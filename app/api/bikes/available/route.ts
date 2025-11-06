/**
 * API Route: GET /api/bikes/available
 * Fetch only available bikes (for enquiry form dropdown)
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const bikes = await sql`
      SELECT id, brand, model, price, status
      FROM bikes
      WHERE status = 'available'
      ORDER BY created_at DESC
    `;

    // Format for dropdown
    const formattedBikes = bikes.map((bike: any) => ({
      id: bike.id,
      brand: bike.brand,
      model: bike.model,
      price: bike.price,
      displayName: `${bike.brand} ${bike.model} - ${bike.price}`,
    }));

    return NextResponse.json({ bikes: formattedBikes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching available bikes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available bikes' },
      { status: 500 }
    );
  }
}

