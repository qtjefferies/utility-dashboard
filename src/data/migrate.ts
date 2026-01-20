#!/usr/bin/env node

/**
 * Database Migration Runner
 * Description: Runs SQL migration files in order and tracks executed migrations
 * Usage: tsx src/data/migrate.ts
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Pool } = pg;

// Get database configuration from environment or defaults
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'athlete_dashboard',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

// Create connection pool
const pool = new Pool(DB_CONFIG);

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Create migrations tracking table if it doesn't exist
 */
async function createMigrationsTable(client: pg.PoolClient): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

/**
 * Check if a migration has already been executed
 */
async function isMigrationExecuted(
  client: pg.PoolClient,
  name: string
): Promise<boolean> {
  const result = await client.query(
    'SELECT 1 FROM migrations WHERE name = $1',
    [name]
  );
  return result.rows.length > 0;
}

/**
 * Mark a migration as executed
 */
async function markMigrationExecuted(
  client: pg.PoolClient,
  name: string
): Promise<void> {
  await client.query('INSERT INTO migrations (name) VALUES ($1)', [name]);
}

/**
 * Execute a SQL migration file
 */
async function executeMigration(
  client: pg.PoolClient,
  filePath: string,
  fileName: string
): Promise<void> {
  console.log(`\n📄 Running migration: ${fileName}`);

  try {
    const sql = readFileSync(filePath, 'utf-8');

    // Split by semicolons but preserve function/trigger definitions
    // For now, execute the entire file as one statement
    await client.query(sql);

    await markMigrationExecuted(client, fileName);
    console.log(`✅ Migration completed: ${fileName}`);
  } catch (error) {
    console.error(`❌ Migration failed: ${fileName}`);
    throw error;
  }
}

/**
 * Run additional SQL files (functions, views, indexes)
 */
async function runAdditionalFiles(client: pg.PoolClient): Promise<void> {
  const additionalFiles = [
    { path: join(__dirname, 'functions', 'kpi_calculations.sql'), name: 'KPI Functions' },
    { path: join(__dirname, 'functions', 'page_functions.sql'), name: 'Page Functions' },
    { path: join(__dirname, 'views', 'dashboard_views.sql'), name: 'Dashboard Views' },
    { path: join(__dirname, 'indexes', 'performance_indexes.sql'), name: 'Performance Indexes' },
  ];

  for (const file of additionalFiles) {
    try {
      console.log(`\n📄 Running: ${file.name}`);
      const sql = readFileSync(file.path, 'utf-8');
      await client.query(sql);
      console.log(`✅ Completed: ${file.name}`);
    } catch (error) {
      console.error(`❌ Failed: ${file.name}`);
      console.error(error);
      throw error;
    }
  }
}

/**
 * Main migration runner
 */
async function runMigrations(): Promise<void> {
  const client = await pool.connect();

  try {
    console.log('🚀 Starting database migrations...');
    console.log(`📊 Database: ${DB_CONFIG.database} @ ${DB_CONFIG.host}:${DB_CONFIG.port}\n`);

    // Create migrations table
    await createMigrationsTable(client);

    // Get list of migration files
    const migrationsDir = join(__dirname, 'migrations');
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort(); // Sort to ensure order (001, 002, 003, etc.)

    if (files.length === 0) {
      console.log('⚠️  No migration files found in /src/data/migrations');
      return;
    }

    // Execute each migration
    for (const file of files) {
      const filePath = join(migrationsDir, file);

      if (await isMigrationExecuted(client, file)) {
        console.log(`⊘ Skipping (already executed): ${file}`);
        continue;
      }

      await executeMigration(client, filePath, file);
    }

    // Run additional SQL files (functions, views, indexes)
    console.log('\n📚 Running additional SQL files...');
    await runAdditionalFiles(client);

    console.log('\n✨ All migrations completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Migration failed with error:');
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

/**
 * Show migration status without running
 */
async function showStatus(): Promise<void> {
  const client = await pool.connect();

  try {
    console.log('📊 Migration Status\n');
    console.log(`Database: ${DB_CONFIG.database} @ ${DB_CONFIG.host}:${DB_CONFIG.port}\n`);

    // Check if migrations table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'migrations'
      ) as exists
    `);

    if (!tableExists.rows[0].exists) {
      console.log('⚠️  Migrations table does not exist. No migrations have been run.\n');
      return;
    }

    // Get executed migrations
    const result = await client.query(`
      SELECT name, executed_at
      FROM migrations
      ORDER BY executed_at ASC
    `);

    if (result.rows.length === 0) {
      console.log('⚠️  No migrations have been executed yet.\n');
      return;
    }

    console.log('Executed migrations:');
    console.log('──────────────────────────────────────────────────');
    result.rows.forEach((row) => {
      const date = new Date(row.executed_at).toLocaleString();
      console.log(`✅ ${row.name.padEnd(30)} (${date})`);
    });
    console.log('');
  } catch (error) {
    console.error('❌ Error checking status:');
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

/**
 * Rollback last migration (dangerous - use with caution)
 */
async function rollbackLast(): Promise<void> {
  const client = await pool.connect();

  try {
    console.log('⚠️  ROLLBACK MODE - This will remove the last migration record');
    console.log('⚠️  Note: This only removes the tracking record, it does NOT undo the SQL changes!\n');

    const result = await client.query(`
      DELETE FROM migrations
      WHERE id = (SELECT id FROM migrations ORDER BY executed_at DESC LIMIT 1)
      RETURNING name
    `);

    if (result.rows.length === 0) {
      console.log('⚠️  No migrations to roll back.\n');
      return;
    }

    console.log(`✅ Rolled back migration: ${result.rows[0].name}\n`);
    console.log('⚠️  Remember: You must manually undo the database changes if needed!\n');
  } catch (error) {
    console.error('❌ Rollback failed:');
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Parse command line arguments
const command = process.argv[2];

switch (command) {
  case 'status':
    showStatus();
    break;
  case 'rollback':
    rollbackLast();
    break;
  case 'run':
  case undefined:
    runMigrations();
    break;
  default:
    console.log('Usage:');
    console.log('  tsx src/data/migrate.ts          # Run migrations');
    console.log('  tsx src/data/migrate.ts status   # Show migration status');
    console.log('  tsx src/data/migrate.ts rollback # Remove last migration record');
    process.exit(1);
}
