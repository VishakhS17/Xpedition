/**
 * API Route: POST /api/upload
 * Upload image to Cloudflare R2
 */

import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, r2Config } from '@/lib/r2';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${randomBytes(16).toString('hex')}.${fileExtension}`;
    const filePath = `bikes/${fileName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: r2Config.bucketName,
      Key: filePath,
      Body: buffer,
      ContentType: file.type,
    });

    await r2Client.send(command);

    // Construct public URL
    const imageUrl = `${r2Config.publicUrl}/${filePath}`;

    return NextResponse.json(
      {
        success: true,
        url: imageUrl,
        fileName: filePath,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

