/**
 * API Route: PATCH /api/enquiries/[id] - Update enquiry status
 * DELETE /api/enquiries/[id] - Delete enquiry
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json();
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid enquiry ID' },
        { status: 400 }
      );
    }

    if (status !== 'resolved' && status !== 'pending') {
      return NextResponse.json(
        { error: 'Invalid status. Must be "resolved" or "pending"' },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE enquiries
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      enquiry: result[0],
    });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid enquiry ID' },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM enquiries
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

