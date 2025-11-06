# Complete Setup Guide: Neon Database + Cloudflare R2

This guide will walk you through setting up both Neon Database and Cloudflare R2 from scratch.

---

## 📋 Table of Contents

1. [Neon Database Setup](#neon-database-setup)
2. [Cloudflare R2 Setup](#cloudflare-r2-setup)
3. [Environment Variables](#environment-variables)
4. [Install Dependencies](#install-dependencies)
5. [Run Database Migration](#run-database-migration)
6. [Verify Setup](#verify-setup)

---

## 🗄️ Part 1: Neon Database Setup

### Step 1: Create Neon Account

1. Go to **[neon.tech](https://neon.tech)**
2. Click **"Sign Up"** (top right)
   - You can sign up with:
     - Email
     - GitHub
     - Google
3. Verify your email if required

### Step 2: Create a New Project

1. After logging in, click **"Create Project"** (or **"New Project"**)
2. Fill in the project details:
   - **Project Name:** `xpedition` (or your preferred name)
   - **Region:** Choose closest to your users
     - **For India/South Asia:** `AWS Asia Pacific 1 (Singapore)` (closest option)
     - **For US East Coast:** `AWS US East 1 (N. Virginia)` or `AWS US East 2 (Ohio)`
     - **For US West Coast:** `AWS US West 2 (Oregon)`
     - **For Europe:** `AWS Europe Central 1 (Frankfurt)` or `AWS Europe West 2 (London)`
     - **For Australia:** `AWS Asia Pacific 2 (Sydney)`
     - **For South America:** `AWS South America East 1 (São Paulo)`
   - **PostgreSQL Version:** `16` (recommended, or latest)
3. Click **"Create Project"**

### Step 3: Get Your Connection String

After project creation, you'll see the **Connection Details** panel.

1. Look for the **Connection String** section
2. You'll see something like:
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. Click **"Copy"** to copy the connection string
4. **Save this somewhere safe** - you'll need it later!

### Step 4: Access SQL Editor

1. In your Neon dashboard, click on your project
2. In the left sidebar, click **"SQL Editor"**
3. This is where you'll run database migration scripts

### Step 5: Run Database Migration

1. In the SQL Editor, click **"New Query"**
2. Open the file `database/migration.sql` from your project
3. Copy the entire contents of `migration.sql`
4. Paste it into the SQL Editor
5. Click **"Run"** (or press `Ctrl+Enter`)
6. You should see: **"Success. No rows returned"**

✅ **Neon Database is now set up!**

---

## ☁️ Part 2: Cloudflare R2 Setup

### Step 1: Create Cloudflare Account

1. Go to **[cloudflare.com](https://cloudflare.com)**
2. Click **"Sign Up"** (top right)
3. Enter your email and create a password
4. Verify your email

### Step 2: Enable R2 (Beta Feature)

1. After logging in, in the left sidebar, click **"R2"**
2. If you see a message about enabling R2:
   - Click **"Enable R2"**
   - Accept terms and conditions
   - Wait for setup to complete (usually instant)

### Step 3: Create an R2 Bucket

1. In the R2 dashboard, click **"Create Bucket"** (top right)
2. Fill in the details:
   - **Bucket Name:** `xpedition-bike-images`
     - ⚠️ **Important:** Bucket names must be globally unique
     - If taken, try: `xpedition-bikes-[yourname]` or `xpedition-images-[random]`
   - **Location:** Choose closest to your users
     - For India: `Asia Pacific`
     - For US: `US East`
     - For Europe: `Europe`
3. Click **"Create Bucket"**
4. ✅ Your bucket is now created!

### Step 4: Get Your Account ID

1. While in the R2 dashboard, look at the top right
2. You'll see your **Account ID** (looks like: `abc123def456...`)
3. **Copy this** - you'll need it later

Alternatively:
1. Click on **"Settings"** (gear icon) in the top right
2. Your **Account ID** is displayed there
3. Copy it

### Step 5: Create R2 API Token

1. In the R2 dashboard, look at the top right for **"Manage R2 API Tokens"**
   - Or go to: [Cloudflare Dashboard → R2 → Manage R2 API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **"Create API Token"**
3. Fill in the token details:
   
   **Step 1: Customize Token**
   - **Token Name:** `xpedition-r2-token` (or any name you prefer)
   - **Permissions:**
     - Select **"Object Read & Write"**
     - Select **"Bucket Read & Write"**
   - **Bucket Access:**
     - Select **"Specific bucket"**
     - Choose your bucket: `xpedition-bike-images`
   
   **Step 2: Account Resources**
   - **Include:** Select your account (should be auto-selected)
   
4. Click **"Continue to summary"**
5. Review and click **"Create Token"**
6. ⚠️ **IMPORTANT:** You'll see your credentials:
   - **Access Key ID** (looks like: `abc123...`)
   - **Secret Access Key** (looks like: `xyz789...`)
7. **Copy both immediately!** You won't see the secret key again!
8. Save them securely (password manager, text file, etc.)

### Step 6: Configure Public Access (Optional)

**Option A: Public Bucket (Easier, but less secure)**
1. Go to your bucket in R2 dashboard
2. Click **"Settings"** tab
3. Find **"Public Access"** section
4. Enable **"Public Access"**
5. This allows direct public URLs to your images

**Option B: Signed URLs (More secure, recommended)**
1. Keep public access **disabled**
2. Use signed URLs in your API (we'll implement this later)

### Step 7: Get Your R2 Endpoint URL

Your R2 endpoint URLs will be:
- **API Endpoint:** `https://[account-id].r2.cloudflarestorage.com`
- **Public URL (if enabled):** `https://pub-[account-id].r2.dev`

Replace `[account-id]` with your Account ID from Step 4.

Example:
- Account ID: `abc123def456`
- API Endpoint: `https://abc123def456.r2.cloudflarestorage.com`
- Public URL: `https://pub-abc123def456.r2.dev`

✅ **Cloudflare R2 is now set up!**

---

## 🔐 Part 3: Environment Variables

### Step 1: Create .env.local File

1. In your project root directory, create a file named `.env.local`
2. If it already exists, open it

### Step 2: Add Your Credentials

Copy this template and fill in your values:

```env
# ============================================
# NEON DATABASE CONFIGURATION
# ============================================
# Get this from Neon dashboard -> Connection Details
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require

# ============================================
# CLOUDFLARE R2 CONFIGURATION
# ============================================
# Account ID: Found in R2 dashboard -> Settings
R2_ACCOUNT_ID=your-account-id-here

# Access credentials: From R2 dashboard -> Manage R2 API Tokens
R2_ACCESS_KEY_ID=your-access-key-id-here
R2_SECRET_ACCESS_KEY=your-secret-access-key-here

# Bucket name: The bucket you created
R2_BUCKET_NAME=xpedition-bike-images

# Public URL: https://pub-[account-id].r2.dev (if public access enabled)
R2_PUBLIC_URL=https://pub-your-account-id.r2.dev

# R2 Endpoint: https://[account-id].r2.cloudflarestorage.com
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com

# ============================================
# APPLICATION CONFIGURATION
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Fill in Your Values

**From Neon:**
- `DATABASE_URL` - Your connection string from Neon (Step 3 of Neon setup)

**From Cloudflare R2:**
- `R2_ACCOUNT_ID` - Your Account ID (Step 4 of R2 setup)
- `R2_ACCESS_KEY_ID` - Your Access Key ID (Step 5 of R2 setup)
- `R2_SECRET_ACCESS_KEY` - Your Secret Access Key (Step 5 of R2 setup)
- `R2_BUCKET_NAME` - Your bucket name (e.g., `xpedition-bike-images`)
- `R2_PUBLIC_URL` - Replace `your-account-id` with your Account ID
- `R2_ENDPOINT` - Replace `your-account-id` with your Account ID

### Step 4: Save and Verify

1. Save the `.env.local` file
2. Make sure it's in `.gitignore` (it should be already)
3. **Never commit this file to git!**

---

## 📦 Part 4: Install Dependencies

### Step 1: Install Required Packages

Open your terminal in the project root directory and run:

```bash
npm install @neondatabase/serverless @aws-sdk/client-s3 @aws-sdk/s3-request-presigner browser-image-compression
```

Or if using yarn:

```bash
yarn add @neondatabase/serverless @aws-sdk/client-s3 @aws-sdk/s3-request-presigner browser-image-compression
```

### Step 2: Verify Installation

Check that packages are installed:

```bash
npm list @neondatabase/serverless @aws-sdk/client-s3 browser-image-compression
```

You should see all three packages listed.

---

## 🗃️ Part 5: Run Database Migration

### Step 1: Open SQL Editor in Neon

1. Go to [neon.tech](https://neon.tech) and log in
2. Click on your project
3. Click **"SQL Editor"** in the left sidebar

### Step 2: Run Migration Script

1. In SQL Editor, click **"New Query"**
2. Open the file `database/migration.sql` from your project
3. Copy the **entire contents** of the file
4. Paste into the SQL Editor
5. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)
6. You should see: **"Success. No rows returned"**

### Step 3: Verify Tables Created

1. In Neon dashboard, click **"Tables"** in the left sidebar
2. You should see:
   - ✅ `bikes` table
   - ✅ `admin_users` table (optional)

Or run this query in SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see both tables listed.

---

## ✅ Part 6: Verify Setup

### Verify Neon Database

1. In Neon SQL Editor, run this query:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bikes' 
ORDER BY ordinal_position;
```

2. You should see all the bike table columns listed.

### Verify Cloudflare R2

1. Go to Cloudflare R2 dashboard
2. Click on your bucket: `xpedition-bike-images`
3. You should see an empty bucket (ready for uploads)
4. Try uploading a test image:
   - Click **"Upload"**
   - Select any image file
   - Click **"Upload"**
   - You should see the file in your bucket

### Verify Environment Variables

1. Make sure `.env.local` exists in your project root
2. Check that all variables are filled in
3. Restart your Next.js dev server if it's running:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

### Test Database Connection

Create a test file `test-db.ts` (temporary):

```typescript
import { sql } from './lib/db';

async function test() {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connected:', result[0]);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

test();
```

Run it (if you have ts-node installed):
```bash
npx ts-node test-db.ts
```

Or test via API route (we'll create this later).

---

## 🎯 Summary Checklist

- [ ] Neon account created
- [ ] Neon project created
- [ ] Neon connection string copied
- [ ] Database migration script run successfully
- [ ] Cloudflare account created
- [ ] R2 enabled
- [ ] R2 bucket created
- [ ] R2 Account ID copied
- [ ] R2 API token created
- [ ] R2 Access Key ID and Secret Access Key saved
- [ ] `.env.local` file created with all credentials
- [ ] Dependencies installed
- [ ] Database tables verified
- [ ] R2 bucket accessible

---

## 🆘 Troubleshooting

### Neon Database Issues

**Problem:** Can't connect to database
- ✅ Check connection string includes `?sslmode=require`
- ✅ Verify you copied the complete connection string
- ✅ Check if IP restrictions are enabled (disable for development)

**Problem:** Migration script fails
- ✅ Check PostgreSQL version (should be 14+)
- ✅ Verify you have proper permissions
- ✅ Check for syntax errors in SQL

**Problem:** Tables not showing
- ✅ Refresh the dashboard
- ✅ Check if you're in the correct project
- ✅ Verify migration script ran successfully

### Cloudflare R2 Issues

**Problem:** Can't create bucket
- ✅ Bucket name must be globally unique (try different name)
- ✅ Bucket names must be lowercase, alphanumeric, and hyphens only
- ✅ Check if R2 is enabled in your account

**Problem:** API token not working
- ✅ Verify you copied both Access Key ID and Secret Access Key
- ✅ Check token permissions include Object Read & Write
- ✅ Verify bucket access is set correctly

**Problem:** Can't upload files
- ✅ Check bucket permissions
- ✅ Verify API token has correct permissions
- ✅ Check environment variables are correct

### Environment Variables Issues

**Problem:** Variables not loading
- ✅ Make sure file is named `.env.local` (not `.env`)
- ✅ Restart Next.js dev server after adding variables
- ✅ Variables must start with `NEXT_PUBLIC_` to be accessible in browser
- ✅ Check for typos in variable names

---

## 📚 Next Steps

After completing setup, you're ready to:

1. **Create API routes** for:
   - Image upload to R2
   - Bike CRUD operations
   - Fetching bikes from database

2. **Create admin dashboard** with:
   - Drag-and-drop image upload
   - Bike form (add/edit)
   - Browser-side image optimization

3. **Update components** to:
   - Fetch from database instead of static data
   - Use R2 image URLs

---

## 📖 Additional Resources

- **Neon Documentation:** [neon.tech/docs](https://neon.tech/docs)
- **Cloudflare R2 Documentation:** [developers.cloudflare.com/r2](https://developers.cloudflare.com/r2/)
- **AWS S3 SDK (R2 compatible):** [docs.aws.amazon.com/sdk-for-javascript](https://docs.aws.amazon.com/sdk-for-javascript/v3/)

---

## ✅ Setup Complete!

Once you've completed all steps and verified everything works, you're ready to start building!

Need help with the next steps? Let me know!

