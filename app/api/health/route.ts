/**
 * API Route: GET /api/health
 * Health check endpoint - can be used to warm up database connection
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    // Simple query to warm up database connection
    await sql`SELECT 1`;
    
    return NextResponse.json(
      { status: 'ok', timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { status: 'error', error: 'Database connection failed' },
      { status: 500 }
    );
  }
}

