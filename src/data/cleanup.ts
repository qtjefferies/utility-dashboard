#!/usr/bin/env node

/**
 * Database Cleanup
 * Description: Removes all seed data for fresh re-seeding
 * Usage: tsx src/data/cleanup.ts
 */

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

async function cleanup(): Promise<void> {
  const client = await pool.connect();

  try {
    console.log('🧹 Cleaning up database...');
    console.log(`📊 Database: ${DB_CONFIG.database} @ ${DB_CONFIG.host}:${DB_CONFIG.port}\n`);

    // Delete in reverse order of dependencies
    await client.query("DELETE FROM tax_withholdings WHERE athlete_id::text LIKE '10000000%'");
    console.log('✓ Deleted tax_withholdings');

    await client.query("DELETE FROM transaction_overrides WHERE transaction_id IN (SELECT id FROM transactions WHERE athlete_id::text LIKE '10000000%')");
    console.log('✓ Deleted transaction_overrides');

    await client.query("DELETE FROM transactions WHERE athlete_id::text LIKE '10000000%'");
    console.log('✓ Deleted transactions');

    await client.query("DELETE FROM person_roles WHERE person_id::text LIKE '10000000%'");
    console.log('✓ Deleted person_roles');

    await client.query("DELETE FROM people WHERE athlete_id::text LIKE '10000000%'");
    console.log('✓ Deleted people');

    await client.query("DELETE FROM deals WHERE athlete_id::text LIKE '10000000%'");
    console.log('✓ Deleted deals');

    await client.query("DELETE FROM upcoming_tasks WHERE athlete_id::text LIKE '10000000%'");
    console.log('✓ Deleted upcoming_tasks');

    await client.query("DELETE FROM quarterly_tax_payments WHERE athlete_id::text LIKE '10000000%'");
    console.log('✓ Deleted quarterly_tax_payments');

    await client.query("DELETE FROM compliance WHERE athlete_id::text LIKE '10000000%'");
    console.log('✓ Deleted compliance');

    await client.query("DELETE FROM tax_vault WHERE athlete_id::text LIKE '10000000%'");
    console.log('✓ Deleted tax_vault');

    await client.query("DELETE FROM user_settings WHERE athlete_id::text LIKE '10000000%'");
    console.log('✓ Deleted user_settings');

    await client.query("DELETE FROM athletes WHERE id::text LIKE '10000000%'");
    console.log('✓ Deleted athletes');

    console.log('\n✅ Cleanup completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Cleanup failed with error:');
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanup();
