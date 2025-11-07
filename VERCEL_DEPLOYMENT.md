# Deploy to Vercel - Step by Step Guide

## 🚀 Quick Deployment Steps

### Step 1: Sign in to Vercel
1. Go to https://vercel.com
2. Click **"Sign Up"** or **"Log In"**
3. **Recommended:** Sign in with GitHub (makes it easier to import your repo)

### Step 2: Import Your Repository
1. After signing in, click **"Add New Project"** (or **"New Project"**)
2. You'll see a list of your GitHub repositories
3. Find and click on **"Xpedition"** (or your repo name)
4. Click **"Import"**

### Step 3: Configure Project Settings
Vercel will auto-detect Next.js settings. You can leave these as default:
- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./` (default)
- **Build Command:** `next build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### Step 4: Add Environment Variables ⚠️ IMPORTANT
Before deploying, click **"Environment Variables"** and add ALL of these:

```
DATABASE_URL=your-neon-database-url
R2_ACCOUNT_ID=your-r2-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=your-r2-public-url
R2_ENDPOINT=your-r2-endpoint
JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
```

**Important Notes:**
- Copy all values from your `.env.local` file
- For `NEXT_PUBLIC_APP_URL`: Use your Vercel domain (you'll get this after first deployment)
- **Use the Neon Pooler connection string** for `DATABASE_URL` (ends with `-pooler`) for better performance
- Make sure to add them for **Production**, **Preview**, and **Development** environments

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. You'll see a success message with your live URL!

### Step 6: Update NEXT_PUBLIC_APP_URL
After deployment:
1. Go to your project settings → **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL (e.g., `https://xpedition.vercel.app`)
3. Redeploy (or it will auto-update on next push)

## 🔄 Automatic Deployments

After the first deployment:
- **Every push to `main` branch** = Automatic production deployment
- **Every pull request** = Automatic preview deployment
- **No manual deployment needed!**

## ✅ Post-Deployment Checklist

- [ ] All environment variables are set in Vercel
- [ ] `NEXT_PUBLIC_APP_URL` is set to your Vercel domain
- [ ] Database connection uses pooler URL
- [ ] Test admin login at `/admin/login`
- [ ] Test bike listing creation
- [ ] Test image uploads
- [ ] Test enquiry form submission

## 🐛 Troubleshooting

### Build Fails
- Check Vercel build logs for errors
- Ensure all environment variables are set
- Verify `package.json` has correct dependencies

### Database Connection Issues
- Verify `DATABASE_URL` is correct in Vercel
- Use pooler connection string (ends with `-pooler`)
- Check Neon dashboard for connection limits

### Image Upload Issues
- Verify R2 credentials in Vercel environment variables
- Check R2 bucket permissions
- Ensure `R2_PUBLIC_URL` is correct

### Admin Login Not Working
- Verify `JWT_SECRET` is set in Vercel
- Check that admin user exists in database
- Review server logs in Vercel dashboard

## 📚 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Documentation:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment

---

**Your site will be live at:** `https://your-project-name.vercel.app`

