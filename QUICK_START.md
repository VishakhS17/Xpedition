# Quick Start Guide - Neon + Cloudflare R2 Setup

## ⚡ Quick Setup Steps

### 1. **Install Dependencies**
```bash
npm install @neondatabase/serverless @aws-sdk/client-s3 @aws-sdk/s3-request-presigner browser-image-compression
```

### 2. **Set Up Neon Database**

1. Sign up at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Go to SQL Editor → Run `database/migration.sql`

### 3. **Set Up Cloudflare R2**

1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Enable R2 (in dashboard)
3. Create bucket: `xpedition-bike-images`
4. Create API token (with Object Read & Write permissions)
5. Save: Account ID, Access Key ID, Secret Access Key

### 4. **Configure Environment Variables**

1. Copy `env.example.txt` to `.env.local`
2. Fill in all values from Neon and Cloudflare dashboards

```env
DATABASE_URL=postgresql://...
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=xpedition-bike-images
R2_ENDPOINT=https://...
R2_PUBLIC_URL=https://pub-...r2.dev
```

### 5. **Verify Setup**

Files created:
- ✅ `lib/db.ts` - Database connection
- ✅ `lib/r2.ts` - R2 client
- ✅ `database/migration.sql` - Database schema

---

## 📚 Full Documentation

See `SETUP_GUIDE.md` for complete detailed instructions.

---

## 🗄️ Database Schema

The `bikes` table includes:
- All fields from your `Bike` interface
- Timestamps (created_at, updated_at)
- Indexes for performance
- Auto-update trigger for updated_at

See `database/migration.sql` for the complete schema.

---

## ✅ Next Steps

After setup, you'll need:
1. API routes for image upload and bike CRUD
2. Admin dashboard with drag-and-drop upload
3. Update components to fetch from database

Let me know when you're ready to proceed!

