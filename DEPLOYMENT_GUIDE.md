# Deployment Guide: GitHub + Vercel

This guide will help you push your Xpedition project to GitHub and deploy it on Vercel.

---

## 📋 Prerequisites

1. **Git** - If not installed, download from: https://git-scm.com/download/win
2. **GitHub Account** - Sign up at: https://github.com
3. **Vercel Account** - Sign up at: https://vercel.com

---

## 🚀 Step 1: Install Git (if not installed)

1. Download Git for Windows: https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart your terminal/command prompt after installation
4. Verify installation: `git --version`

---

## 📦 Step 2: Initialize Git Repository

Open your terminal in the project directory and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Xpedition bike dealership website"
```

---

## 🔐 Step 3: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `xpedition` (or your preferred name)
4. Description: "Exotic Super Bikes Dealership Website"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

---

## 📤 Step 4: Push to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/xpedition.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note:** You'll be prompted for your GitHub username and password. For password, use a **Personal Access Token** (not your GitHub password):
- Go to: https://github.com/settings/tokens
- Click "Generate new token (classic)"
- Select scopes: `repo` (full control)
- Generate and copy the token
- Use this token as your password when pushing

---

## 🌐 Step 5: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com and sign in (use GitHub to sign in for easier setup)
2. Click **"Add New Project"**
3. Import your GitHub repository (`xpedition`)
4. Vercel will auto-detect Next.js settings
5. **Configure Environment Variables:**
   - Click **"Environment Variables"**
   - Add all variables from your `.env.local` file:
     ```
     DATABASE_URL=your-neon-database-url
     R2_ACCOUNT_ID=your-r2-account-id
     R2_ACCESS_KEY_ID=your-r2-access-key
     R2_SECRET_ACCESS_KEY=your-r2-secret-key
     R2_BUCKET_NAME=your-bucket-name
     R2_PUBLIC_URL=your-r2-public-url
     R2_ENDPOINT=your-r2-endpoint
     JWT_SECRET=your-jwt-secret
     NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
     ```
6. Click **"Deploy"**
7. Wait for deployment to complete (usually 2-3 minutes)

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? xpedition
# - Directory? ./
# - Override settings? No
```

---

## ⚙️ Step 6: Configure Environment Variables in Vercel

1. Go to your project dashboard on Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add all environment variables from your `.env.local`:
   - `DATABASE_URL`
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET_NAME`
   - `R2_PUBLIC_URL`
   - `R2_ENDPOINT`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL` (set this to your Vercel URL after first deployment)

4. **Important:** For `NEXT_PUBLIC_APP_URL`, use your Vercel deployment URL:
   - Format: `https://your-project-name.vercel.app`
   - You'll get this after the first deployment

---

## 🔄 Step 7: Update Database Connection (Important!)

After deployment, update your Neon database connection:

1. Go to Neon dashboard → Your project → Connection Details
2. **Use the Pooler connection string** (ends with `-pooler`)
3. Update `DATABASE_URL` in Vercel environment variables with the pooler URL
4. This reduces cold start times significantly

---

## 📝 Step 8: Post-Deployment Checklist

- [ ] All environment variables are set in Vercel
- [ ] `NEXT_PUBLIC_APP_URL` is set to your Vercel domain
- [ ] Database connection uses pooler URL
- [ ] Test admin login at `/admin/login`
- [ ] Test bike listing creation
- [ ] Test image uploads
- [ ] Test enquiry form submission

---

## 🔗 Step 9: Custom Domain (Optional)

1. In Vercel dashboard → Your project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will automatically configure SSL

---

## 🐛 Troubleshooting

### Build Fails
- Check Vercel build logs for errors
- Ensure all environment variables are set
- Verify `package.json` has correct dependencies

### Database Connection Issues
- Verify `DATABASE_URL` is correct in Vercel
- Use pooler connection string for better performance
- Check Neon dashboard for connection limits

### Image Upload Issues
- Verify R2 credentials in Vercel environment variables
- Check R2 bucket permissions
- Ensure `R2_PUBLIC_URL` is correct

### Admin Login Not Working
- Verify `JWT_SECRET` is set in Vercel
- Check that admin user exists in database
- Review server logs in Vercel dashboard

---

## 📚 Useful Links

- **Vercel Documentation:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **GitHub Docs:** https://docs.github.com
- **Neon Connection Pooling:** https://neon.tech/docs/connect/connection-pooling

---

## ✅ Success!

Once deployed, your site will be live at:
- **Vercel URL:** `https://your-project-name.vercel.app`
- **Custom Domain:** (if configured)

Every push to the `main` branch will automatically trigger a new deployment!

---

**Need Help?** Check Vercel deployment logs or GitHub issues for common problems.

