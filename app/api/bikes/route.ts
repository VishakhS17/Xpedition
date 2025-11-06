/**
 * API Route: GET /api/bikes
 * Fetch all bikes from database
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // Filter by status (e.g., ?status=available)
    const category = searchParams.get('category'); // Filter by category (e.g., ?category=Sport)
    const limit = searchParams.get('limit'); // Limit results (e.g., ?limit=10)

    // Build query with Neon's template literal syntax
    let bikes;
    const limitNum = limit ? parseInt(limit, 10) : null;
    
    // Build WHERE conditions
    let whereConditions: string[] = [];
    if (status) whereConditions.push(`status = '${status}'`);
    if (category) whereConditions.push(`'${category}' = ANY(category)`);
    
    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';
    
    const limitClause = limitNum ? `LIMIT ${limitNum}` : '';
    
    // Use parameterized query for safety
    if (status && category && limitNum) {
      bikes = await sql`
        SELECT * FROM bikes 
        WHERE status = ${status} AND ${category} = ANY(category)
        ORDER BY created_at DESC
        LIMIT ${limitNum}
      `;
    } else if (status && category) {
      bikes = await sql`
        SELECT * FROM bikes 
        WHERE status = ${status} AND ${category} = ANY(category)
        ORDER BY created_at DESC
      `;
    } else if (status && limitNum) {
      bikes = await sql`
        SELECT * FROM bikes 
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limitNum}
      `;
    } else if (category && limitNum) {
      bikes = await sql`
        SELECT * FROM bikes 
        WHERE ${category} = ANY(category)
        ORDER BY created_at DESC
        LIMIT ${limitNum}
      `;
    } else if (status) {
      bikes = await sql`
        SELECT * FROM bikes 
        WHERE status = ${status}
        ORDER BY created_at DESC
      `;
    } else if (category) {
      bikes = await sql`
        SELECT * FROM bikes 
        WHERE ${category} = ANY(category)
        ORDER BY created_at DESC
      `;
    } else if (limitNum) {
      bikes = await sql`
        SELECT * FROM bikes 
        ORDER BY created_at DESC
        LIMIT ${limitNum}
      `;
    } else {
      bikes = await sql`
        SELECT * FROM bikes 
        ORDER BY created_at DESC
      `;
    }

    // Convert arrays and format data
    const formattedBikes = bikes.map((bike: any) => ({
      id: bike.id,
      image: bike.image,
      images: bike.images || [],
      price: bike.price,
      model: bike.model,
      brand: bike.brand,
      category: Array.isArray(bike.category) ? bike.category : bike.category ? [bike.category] : [],
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
      soldAt: bike.sold_at ? new Date(bike.sold_at).toISOString() : undefined,
      createdAt: bike.created_at ? new Date(bike.created_at).toISOString() : undefined,
      updatedAt: bike.updated_at ? new Date(bike.updated_at).toISOString() : undefined,
    }));

    return NextResponse.json({ bikes: formattedBikes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bikes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bikes' },
      { status: 500 }
    );
  }
}

/**
 * API Route: POST /api/bikes
 * Create a new bike
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      image,
      images = [],
      price,
      model,
      brand,
      category,
      regYear,
      kms,
      regState,
      color,
      fuelType,
      engine,
      description,
      features = [],
      condition,
      owner,
      contact,
      status = 'available',
    } = body;

    // Validate required fields
    if (!image || !price || !model || !brand || !regYear || !kms || !regState) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert bike
    const result = await sql`
      INSERT INTO bikes (
        image, images, price, model, brand, category, reg_year, kms, reg_state,
        color, fuel_type, engine, description, features, condition,
        owner, contact, status
      )
      VALUES (
        ${image}, ${images}, ${price}, ${model}, ${brand}, ${category || []}, ${regYear}, ${kms}, ${regState},
        ${color || null}, ${fuelType || null}, ${engine || null}, ${description || null},
        ${features}, ${condition || null}, ${owner || null}, ${contact || null}, ${status}
      )
      RETURNING id, created_at
    `;

    return NextResponse.json(
      {
        success: true,
        bike: {
          id: result[0].id,
          createdAt: result[0].created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating bike:', error);
    return NextResponse.json(
      { error: 'Failed to create bike' },
      { status: 500 }
    );
  }
}

