/**
 * API Route: GET /api/admin/stats
 * Get admin dashboard statistics
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    // Get total value of bikes for sale (available status)
    const availableBikes = await sql`
      SELECT price
      FROM bikes
      WHERE status = 'available'
    `;

    // Get total value of bikes sold
    const soldBikes = await sql`
      SELECT price
      FROM bikes
      WHERE status = 'sold'
    `;

    // Calculate totals
    const totalForSale = availableBikes.reduce((sum, bike) => {
      const price = parseFloat(bike.price.toString().replace(/[₹,]/g, '')) || 0;
      return sum + price;
    }, 0);

    const totalSold = soldBikes.reduce((sum, bike) => {
      const price = parseFloat(bike.price.toString().replace(/[₹,]/g, '')) || 0;
      return sum + price;
    }, 0);

    // Get counts
    const availableCount = availableBikes.length;
    const soldCount = soldBikes.length;

    // Get popular bikes
    const popularBikes = await sql`
      SELECT 
        b.id,
        b.brand,
        b.model,
        b.price,
        b.image,
        b.status,
        COUNT(e.id) as enquiry_count
      FROM bikes b
      LEFT JOIN enquiries e ON e.bike_id = b.id
      WHERE b.status = 'available'
      GROUP BY b.id, b.brand, b.model, b.price, b.image, b.status
      ORDER BY enquiry_count DESC
      LIMIT 5
    `;

    return NextResponse.json({
      stats: {
        totalForSale,
        totalSold,
        availableCount,
        soldCount,
      },
      popularBikes: popularBikes.map((bike) => ({
        id: bike.id,
        brand: bike.brand,
        model: bike.model,
        price: bike.price,
        image: bike.image,
        status: bike.status,
        enquiryCount: Number(bike.enquiry_count),
      })),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

