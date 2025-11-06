/**
 * API Route: GET /api/auth/verify
 * Verify admin authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // Verify user still exists in database
    const users = await sql`
      SELECT id, email, name
      FROM admin_users
      WHERE id = ${decoded.userId} AND email = ${decoded.email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: users[0].id,
        email: users[0].email,
        name: users[0].name,
      },
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}

