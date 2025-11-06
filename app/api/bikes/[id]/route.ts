/**
 * API Route: GET /api/bikes/[id]
 * Fetch a single bike by ID
 */

import { NextResponse } from 'next/server';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { sql } from '@/lib/db';
import { r2Client, r2Config } from '@/lib/r2';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bikeId = parseInt(id, 10);

    if (isNaN(bikeId)) {
      return NextResponse.json(
        { error: 'Invalid bike ID' },
        { status: 400 }
      );
    }

    // Optimized query - only select needed columns
    const bikes = await sql`
      SELECT 
        id, image, images, price, model, brand, category,
        reg_year, kms, reg_state, color, fuel_type, engine,
        description, features, condition, owner, contact,
        status, sold_at, created_at, updated_at
      FROM bikes 
      WHERE id = ${bikeId}
      LIMIT 1
    `;

    if (bikes.length === 0) {
      return NextResponse.json(
        { error: 'Bike not found' },
        { status: 404 }
      );
    }

    const bike = bikes[0];

    // Format bike data
    const formattedBike = {
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
    };

    // Add caching headers for better performance
    return NextResponse.json(
      { bike: formattedBike },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching bike:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bike' },
      { status: 500 }
    );
  }
}

/**
 * API Route: PUT /api/bikes/[id]
 * Update a bike
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bikeId = parseInt(id, 10);
    const body = await request.json();

    if (isNaN(bikeId)) {
      return NextResponse.json(
        { error: 'Invalid bike ID' },
        { status: 400 }
      );
    }

    // Get existing bike data first
    const existingBike = await sql`
      SELECT * FROM bikes WHERE id = ${bikeId} LIMIT 1
    `;

    if (existingBike.length === 0) {
      return NextResponse.json(
        { error: 'Bike not found' },
        { status: 404 }
      );
    }

    const existing = existingBike[0];
    
    // Build update query - only update provided fields
    const soldAt = body.status === 'sold' && !existing.sold_at 
      ? new Date().toISOString() 
      : body.status === 'sold' && existing.sold_at 
        ? existing.sold_at 
        : body.status !== 'sold' 
          ? null 
          : existing.sold_at;

    const result = await sql`
      UPDATE bikes SET
        image = ${body.image !== undefined ? body.image : existing.image},
        images = ${body.images !== undefined ? body.images : existing.images || []},
        price = ${body.price !== undefined ? body.price : existing.price},
        model = ${body.model !== undefined ? body.model : existing.model},
        brand = ${body.brand !== undefined ? body.brand : existing.brand},
        category = ${body.category !== undefined ? body.category : existing.category || []},
        reg_year = ${body.regYear !== undefined ? body.regYear : existing.reg_year},
        kms = ${body.kms !== undefined ? body.kms : existing.kms},
        reg_state = ${body.regState !== undefined ? body.regState : existing.reg_state},
        color = ${body.color !== undefined ? body.color : existing.color},
        fuel_type = ${body.fuelType !== undefined ? body.fuelType : existing.fuel_type},
        engine = ${body.engine !== undefined ? body.engine : existing.engine},
        description = ${body.description !== undefined ? body.description : existing.description},
        features = ${body.features !== undefined ? body.features : existing.features || []},
        condition = ${body.condition !== undefined ? body.condition : existing.condition},
        owner = ${body.owner !== undefined ? body.owner : existing.owner},
        contact = ${body.contact !== undefined ? body.contact : existing.contact},
        status = ${body.status !== undefined ? body.status : existing.status},
        sold_at = ${soldAt}
      WHERE id = ${bikeId}
      RETURNING id
    `;

    return NextResponse.json(
      { success: true, bike: { id: result[0].id } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating bike:', error);
    return NextResponse.json(
      { error: 'Failed to update bike' },
      { status: 500 }
    );
  }
}

/**
 * API Route: DELETE /api/bikes/[id]
 * Delete a bike and its associated images from R2
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bikeId = parseInt(id, 10);

    if (isNaN(bikeId)) {
      return NextResponse.json(
        { error: 'Invalid bike ID' },
        { status: 400 }
      );
    }

    // First, get the bike to retrieve image URLs
    const bikes = await sql`
      SELECT image, images FROM bikes WHERE id = ${bikeId}
    `;

    if (bikes.length === 0) {
      return NextResponse.json(
        { error: 'Bike not found' },
        { status: 404 }
      );
    }

    const bike = bikes[0];
    const imageUrls: string[] = [];

    // Collect all image URLs
    if (bike.image) {
      imageUrls.push(bike.image);
    }
    if (bike.images && Array.isArray(bike.images)) {
      imageUrls.push(...bike.images);
    }

    // Delete images from R2
    const deletePromises = imageUrls.map(async (imageUrl) => {
      try {
        // Extract file path from URL
        const url = new URL(imageUrl);
        const filePath = url.pathname.substring(1); // Remove leading slash

        const command = new DeleteObjectCommand({
          Bucket: r2Config.bucketName,
          Key: filePath,
        });

        await r2Client.send(command);
      } catch (error) {
        // Log error but don't fail the entire operation
        console.error(`Error deleting image ${imageUrl}:`, error);
      }
    });

    // Wait for all image deletions to complete
    await Promise.all(deletePromises);

    // Delete bike from database
    await sql`DELETE FROM bikes WHERE id = ${bikeId}`;

    return NextResponse.json(
      { success: true, message: 'Bike and images deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting bike:', error);
    return NextResponse.json(
      { error: 'Failed to delete bike' },
      { status: 500 }
    );
  }
}

