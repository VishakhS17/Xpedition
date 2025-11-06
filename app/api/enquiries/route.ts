/**
 * API Route: GET /api/enquiries - Get all enquiries
 * POST /api/enquiries - Save an enquiry from the contact form
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const enquiries = await sql`
      SELECT 
        id,
        name,
        email,
        phone,
        bike_id,
        bike_model,
        bike_brand,
        status,
        created_at
      FROM enquiries
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      enquiries: enquiries.map((enquiry) => ({
        id: enquiry.id,
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        bike_id: enquiry.bike_id,
        bike_model: enquiry.bike_model,
        bike_brand: enquiry.bike_brand,
        status: enquiry.status || 'pending',
        created_at: enquiry.created_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, bikeId, bikeModel, bikeBrand } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Get bike model and brand if bikeId is provided
    let finalBikeModel = bikeModel;
    let finalBikeBrand = bikeBrand;

    if (bikeId && !bikeModel) {
      const bikes = await sql`
        SELECT model, brand FROM bikes WHERE id = ${parseInt(bikeId, 10)}
      `;
      if (bikes.length > 0) {
        finalBikeModel = bikes[0].model;
        finalBikeBrand = bikes[0].brand;
      }
    }

    // Insert enquiry
    const result = await sql`
      INSERT INTO enquiries (name, email, phone, bike_id, bike_model, bike_brand)
      VALUES (${name}, ${email}, ${phone}, ${bikeId ? parseInt(bikeId, 10) : null}, ${finalBikeModel || null}, ${finalBikeBrand || null})
      RETURNING id, created_at
    `;

    return NextResponse.json(
      {
        success: true,
        enquiry: {
          id: result[0].id,
          createdAt: result[0].created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to save enquiry' },
      { status: 500 }
    );
  }
}

