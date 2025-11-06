/**
 * API Route: GET /api/popular-bikes
 * Fetch most popular bikes based on enquiry count
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    const limitNum = parseInt(limit, 10);

    // Get popular bikes using the view we created
    const bikes = await sql`
      SELECT * FROM popular_bikes
      ORDER BY enquiry_count DESC, last_enquiry_at DESC NULLS LAST
      LIMIT ${limitNum}
    `;

    // Format bikes
    const formattedBikes = bikes.map((bike: any) => ({
      id: bike.id,
      image: bike.image,
      images: bike.images || [],
      price: bike.price,
      model: bike.model,
      brand: bike.brand,
      regYear: bike.reg_year,
      kms: bike.kms,
      regState: bike.reg_state,
      color: bike.color,
      fuelType: bike.fuel_type,
      engine: bike.engine,
      description: bike.description,
      features: bike.features || [],
      condition: bike.condition,
      owner: bike.owner,
      contact: bike.contact,
      status: bike.status || 'available',
      enquiryCount: parseInt(bike.enquiry_count) || 0,
      lastEnquiryAt: bike.last_enquiry_at
        ? new Date(bike.last_enquiry_at).toISOString()
        : null,
    }));

    return NextResponse.json({ bikes: formattedBikes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching popular bikes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular bikes' },
      { status: 500 }
    );
  }
}

