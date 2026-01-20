#!/usr/bin/env node

/**
 * Database Seed Runner
 * Description: Runs the seed data SQL file directly
 * Usage: tsx src/data/seed.ts
 */

import { readFileSync } from 'fs';
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

async function runSeed(): Promise<void> {
  const client = await pool.connect();

  try {
    console.log('🌱 Starting database seed...');
    console.log(`📊 Database: ${DB_CONFIG.database} @ ${DB_CONFIG.host}:${DB_CONFIG.port}\n`);

    const seedFile = join(__dirname, 'migrations', '005_mock_data_seed.sql');
    console.log(`📄 Running seed file: 005_mock_data_seed.sql`);

    const sql = readFileSync(seedFile, 'utf-8');
    await client.query(sql);

    console.log(`✅ Seed completed successfully!\n`);
  } catch (error) {
    console.error('\n❌ Seed failed with error:');
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
