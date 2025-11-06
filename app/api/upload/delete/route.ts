/**
 * API Route: DELETE /api/upload/delete
 * Delete an image from Cloudflare R2
 */

import { NextResponse } from 'next/server';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, r2Config } from '@/lib/r2';

export async function DELETE(request: Request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Extract the file path from the URL
    // URL format: https://pub-xxx.r2.dev/bikes/filename.jpg
    // We need to extract: bikes/filename.jpg
    const url = new URL(imageUrl);
    const filePath = url.pathname.substring(1); // Remove leading slash

    // Delete from R2
    const command = new DeleteObjectCommand({
      Bucket: r2Config.bucketName,
      Key: filePath,
    });

    await r2Client.send(command);

    return NextResponse.json(
      {
        success: true,
        message: 'Image deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

