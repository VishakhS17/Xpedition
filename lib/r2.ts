/**
 * Cloudflare R2 Client
 * 
 * This file sets up the S3-compatible client for Cloudflare R2.
 * R2 uses the AWS S3 API, so we use the AWS SDK.
 * 
 * Make sure all R2_* environment variables are set in your .env.local file.
 */

import { S3Client } from '@aws-sdk/client-s3';

// Validate environment variables
const requiredEnvVars = [
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_ENDPOINT',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} environment variable is not set`);
  }
}

// Create S3-compatible client for R2
const r2Client = new S3Client({
  region: 'auto', // R2 uses 'auto' for region
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// Export R2 configuration
export const r2Config = {
  bucketName: process.env.R2_BUCKET_NAME!,
  publicUrl: process.env.R2_PUBLIC_URL || `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev`,
  accountId: process.env.R2_ACCOUNT_ID!,
};

export { r2Client };

