/**
 * Neon Database Connection
 * 
 * This file sets up the connection to Neon PostgreSQL database.
 * Make sure DATABASE_URL is set in your .env.local file.
 * 
 * IMPORTANT: Use a pooler connection string (ends with -pooler) to reduce cold starts!
 * Example: postgresql://...@ep-xxx-xxx-pooler.region.aws.neon.tech/neondb
 * 
 * To get pooler URL:
 * 1. Go to Neon dashboard
 * 2. Click on your project
 * 3. Go to "Connection Details"
 * 4. Select "Pooler" tab
 * 5. Copy the connection string that includes "-pooler" in the hostname
 */

import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Use pooler connection if available (reduces cold start time significantly)
// Pooler URLs end with "-pooler" in the hostname
const databaseUrl = process.env.DATABASE_URL;

// Check if using pooler connection
const isPooler = databaseUrl.includes('-pooler');
if (!isPooler) {
  console.warn('⚠️  Consider using a pooler connection string to reduce cold starts!');
  console.warn('   Pooler URLs end with "-pooler" in the hostname');
  console.warn('   Get it from Neon dashboard -> Connection Details -> Pooler tab');
}

const sql = neon(databaseUrl);

// Warmup function to keep connection alive (optional - can be called on app start)
export async function warmupConnection() {
  try {
    await sql`SELECT 1`;
  } catch (error) {
    console.error('Database warmup failed:', error);
  }
}

export { sql };

