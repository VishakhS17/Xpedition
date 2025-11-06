# Complete Setup Guide: Neon Database + Cloudflare R2

## 📋 Table of Contents
1. [Database Schema Design](#database-schema-design)
2. [Neon Database Setup](#neon-database-setup)
3. [Cloudflare R2 Setup](#cloudflare-r2-setup)
4. [Environment Variables](#environment-variables)
5. [Installation & Configuration](#installation--configuration)
6. [Database Migration](#database-migration)

---

## 🗄️ Database Schema Design

### **Bikes Table**

Based on your `Bike` interface, here's the optimized PostgreSQL schema:

```sql
-- Bikes table
CREATE TABLE bikes (
  id SERIAL PRIMARY KEY,
  
  -- Images (stored as URLs in Cloudflare R2)
  image TEXT NOT NULL,                    -- Main image URL
  images TEXT[] DEFAULT '{}',             -- Array of additional image URLs
  
  -- Basic Information
  price TEXT NOT NULL,                    -- e.g., "₹6,25,000"
  model TEXT NOT NULL,                    -- e.g., "KAWASAKI Z900 ABS"
  brand TEXT NOT NULL,                    -- e.g., "Kawasaki"
  
  -- Registration Details
  reg_year TEXT NOT NULL,                 -- e.g., "2020"
  reg_state TEXT NOT NULL,                -- e.g., "Maharashtra"
  
  -- Bike Details
  kms TEXT NOT NULL,                      -- e.g., "15,000"
  color TEXT,                             -- e.g., "Metallic Spark Black"
  fuel_type TEXT,                         -- e.g., "Petrol"
  engine TEXT,                            -- e.g., "948cc, 4-Cylinder"
  condition TEXT,                         -- e.g., "Excellent", "Like New", "Mint"
  
  -- Description
  description TEXT,                       -- Full description text
  
  -- Features (stored as array)
  features TEXT[] DEFAULT '{}',          -- e.g., ["ABS", "LED Lighting", ...]
  
  -- Owner Information
  owner TEXT,                             -- e.g., "First Owner", "Second Owner"
  contact TEXT,                           -- Phone number
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for better query performance
  CONSTRAINT bikes_model_check CHECK (char_length(model) > 0),
  CONSTRAINT bikes_brand_check CHECK (char_length(brand) > 0),
  CONSTRAINT bikes_price_check CHECK (char_length(price) > 0)
);

-- Create indexes for faster queries
CREATE INDEX idx_bikes_brand ON bikes(brand);
CREATE INDEX idx_bikes_reg_year ON bikes(reg_year);
CREATE INDEX idx_bikes_reg_state ON bikes(reg_state);
CREATE INDEX idx_bikes_created_at ON bikes(created_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on row update
CREATE TRIGGER update_bikes_updated_at 
    BEFORE UPDATE ON bikes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### **Optional: Admin Users Table** (for future authentication)

```sql
-- Admin users table (optional, for future admin dashboard)
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_admin_users_email ON admin_users(email);
```

---

## 🚀 Neon Database Setup

### **Step 1: Sign Up for Neon**

1. Go to [neon.tech](https://neon.tech)
2. Click **"Sign Up"** (can use GitHub account)
3. Verify your email

### **Step 2: Create a Project**

1. Click **"Create Project"**
2. Fill in details:
   - **Project Name:** `xpedition` (or your preferred name)
   - **Region:** Choose closest to your users (e.g., `AWS Asia Pacific (Mumbai)`)
   - **PostgreSQL Version:** `16` (recommended)
3. Click **"Create Project"**

### **Step 3: Get Connection String**

1. After project creation, you'll see the **Connection Details**
2. Copy the **Connection String** (it looks like):
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
3. Save this for later (you'll need it in environment variables)

### **Step 4: Access Database Dashboard**

1. Click on your project
2. Navigate to **"SQL Editor"** in the left sidebar
3. This is where you'll run the migration script

---

## ☁️ Cloudflare R2 Setup

### **Step 1: Sign Up for Cloudflare**

1. Go to [cloudflare.com](https://cloudflare.com)
2. Click **"Sign Up"** (free account is fine)
3. Verify your email

### **Step 2: Enable R2 (Beta)**

1. Log in to Cloudflare dashboard
2. In the left sidebar, click **"R2"**
3. If you see a message about enabling R2, click **"Enable R2"**
4. Accept terms and conditions

### **Step 3: Create a Bucket**

1. Click **"Create Bucket"**
2. Fill in details:
   - **Bucket Name:** `xpedition-bike-images` (must be globally unique)
   - **Location:** Choose closest region (e.g., `Asia Pacific`)
3. Click **"Create Bucket"**

### **Step 4: Create API Token**

1. Go to **"Manage R2 API Tokens"** (top right)
2. Click **"Create API Token"**
3. Fill in:
   - **Token Name:** `xpedition-r2-token`
   - **Permissions:** 
     - ✅ **Object Read & Write**
     - ✅ **Bucket Read & Write**
   - **Bucket Access:** Select your bucket (`xpedition-bike-images`)
4. Click **"Create API Token"**
5. **IMPORTANT:** Copy the credentials immediately:
   - **Access Key ID**
   - **Secret Access Key**
   - Save these securely (you won't see them again!)

### **Step 5: Configure Public Access (Optional)**

If you want direct public URLs:

1. Go to your bucket
2. Click **"Settings"**
3. Enable **"Public Access"** (if you want direct URLs)
4. Or use **Signed URLs** (more secure, recommended)

### **Step 6: Get R2 Endpoint URL**

1. Go to your bucket
2. Click **"Settings"**
3. Find your **Account ID** (needed for API calls)
4. Your R2 endpoint will be:
   ```
   https://<account-id>.r2.cloudflarestorage.com
   ```
   Or use the public domain if configured:
   ```
   https://pub-<account-id>.r2.dev
   ```

---

## 🔐 Environment Variables

Create a `.env.local` file in your project root:

```env
# Neon Database
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require

# Cloudflare R2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=xpedition-bike-images
R2_PUBLIC_URL=https://pub-<account-id>.r2.dev
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com

# App Configuration (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:**
- Add `.env.local` to `.gitignore` (never commit secrets!)
- Use these variables in your code via `process.env.VARIABLE_NAME`

---

## 📦 Installation & Configuration

### **Step 1: Install Required Packages**

```bash
npm install @neondatabase/serverless @aws-sdk/client-s3 @aws-sdk/s3-request-presigner browser-image-compression
```

Or with specific versions:

```bash
npm install @neondatabase/serverless@^2.0.0 @aws-sdk/client-s3@^3.0.0 @aws-sdk/s3-request-presigner@^3.0.0 browser-image-compression@^2.0.0
```

### **Step 2: Create Database Connection File**

Create `lib/db.ts`:

```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export { sql };
```

### **Step 3: Create R2 Client File**

Create `lib/r2.ts`:

```typescript
import { S3Client } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export { r2Client };
```

---

## 🗃️ Database Migration

### **Step 1: Run Migration Script**

Copy the SQL schema from [Database Schema Design](#database-schema-design) above.

### **Step 2: Execute in Neon SQL Editor**

1. Go to Neon dashboard
2. Click on your project
3. Open **"SQL Editor"**
4. Paste the complete SQL schema
5. Click **"Run"**
6. Verify tables are created (check **"Tables"** in sidebar)

### **Step 3: Verify Migration**

Run this query to verify:

```sql
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'bikes'
ORDER BY ordinal_position;
```

---

## 📝 Next Steps

After setup, you'll need:

1. **API Routes** for:
   - Uploading images to R2
   - CRUD operations for bikes
   - Fetching bikes from database

2. **Admin Dashboard** with:
   - Drag-and-drop image upload
   - Bike form (add/edit)
   - Image optimization (browser-side)

3. **Update Components** to:
   - Fetch from database instead of static data
   - Use R2 image URLs

---

## ✅ Verification Checklist

- [ ] Neon project created
- [ ] Database connection string saved
- [ ] Migration script executed successfully
- [ ] Cloudflare R2 account created
- [ ] R2 bucket created
- [ ] R2 API token created and saved
- [ ] Environment variables configured
- [ ] Packages installed
- [ ] Database connection file created
- [ ] R2 client file created

---

## 🆘 Troubleshooting

### **Neon Connection Issues:**
- Make sure `sslmode=require` is in connection string
- Verify connection string is correct
- Check if IP restrictions are enabled

### **R2 Upload Issues:**
- Verify credentials are correct
- Check bucket name matches
- Ensure endpoint URL is correct
- Verify bucket permissions

### **Database Migration Issues:**
- Check PostgreSQL version (should be 14+)
- Verify you have proper permissions
- Check for syntax errors in SQL

---

## 📚 Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [AWS S3 SDK (R2 compatible)](https://docs.aws.amazon.com/sdk-for-javascript/v3/)

---

**Ready to proceed? Let me know if you want me to implement the API routes and admin dashboard next!**

