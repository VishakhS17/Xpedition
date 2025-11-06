# Step-by-Step Guide: Push to GitHub

## Prerequisites

### Step 1: Install Git (if not already installed)

1. Download Git from: https://git-scm.com/download/win
2. Run the installer and follow the setup wizard
3. Use default settings (recommended)
4. After installation, restart your terminal/PowerShell

### Step 2: Verify Git Installation

Open PowerShell or Command Prompt and run:
```bash
git --version
```

If you see a version number, Git is installed correctly.

---

## GitHub Setup

### Step 3: Create a GitHub Account (if you don't have one)

1. Go to https://github.com
2. Sign up for a free account
3. Verify your email address

### Step 4: Create a New Repository on GitHub

1. Log in to GitHub
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Repository name: `Xpedition` (or your preferred name)
5. Description: "Bike dealership website" (optional)
6. Choose **Public** or **Private**
7. **DO NOT** initialize with README, .gitignore, or license (we already have files)
8. Click "Create repository"

---

## Local Git Setup

### Step 5: Initialize Git in Your Project

Open PowerShell in your project directory (`D:\Vishakh\Projects\Xpedition`) and run:

```bash
git init
```

### Step 6: Configure Git (if first time)

Set your name and email (replace with your GitHub credentials):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 7: Check Your .gitignore File

Your `.gitignore` file should already exclude sensitive files like `.env.local`. Verify it includes:
- `.env*.local` (your environment variables)
- `node_modules/`
- `.next/`

**IMPORTANT:** Make sure `.env.local` is NOT committed to GitHub (it contains your database credentials and API keys).

### Step 8: Add All Files to Git

```bash
git add .
```

This stages all files except those in `.gitignore`.

### Step 9: Check What Will Be Committed

```bash
git status
```

Review the list. Make sure `.env.local` is NOT listed. If it is, check your `.gitignore` file.

### Step 10: Create Your First Commit

```bash
git commit -m "Initial commit: Xpedition bike dealership website"
```

---

## Connect to GitHub

### Step 11: Add GitHub Remote

After creating the repository on GitHub, you'll see a page with setup instructions. Copy the repository URL (it looks like: `https://github.com/yourusername/Xpedition.git`)

Then run:

```bash
git remote add origin https://github.com/yourusername/Xpedition.git
```

Replace `yourusername` with your actual GitHub username.

### Step 12: Rename Branch to Main (if needed)

```bash
git branch -M main
```

### Step 13: Push to GitHub

```bash
git push -u origin main
```

You'll be prompted for your GitHub username and password. 
**Note:** If you have 2FA enabled, you'll need to use a Personal Access Token instead of your password.

---

## If You Need a Personal Access Token (for 2FA)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "Xpedition Project"
4. Select scopes: Check `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)
7. Use this token as your password when pushing

---

## Future Updates

After making changes to your code:

```bash
# 1. Check what changed
git status

# 2. Add changed files
git add .

# 3. Commit with a message
git commit -m "Description of your changes"

# 4. Push to GitHub
git push
```

---

## Troubleshooting

### If you get "fatal: not a git repository"
Run `git init` first (Step 5)

### If you get "remote origin already exists"
Remove it first:
```bash
git remote remove origin
```
Then add it again (Step 11)

### If you get authentication errors
- Make sure you're using the correct username
- Use a Personal Access Token if you have 2FA enabled
- Check that your repository URL is correct

### If .env.local is being tracked
```bash
# Remove it from tracking
git rm --cached .env.local

# Add to .gitignore (if not already there)
echo ".env.local" >> .gitignore

# Commit the change
git add .gitignore
git commit -m "Remove .env.local from tracking"
```

---

## Security Checklist

Before pushing, make sure:
- ✅ `.env.local` is in `.gitignore`
- ✅ No API keys or secrets are in your code
- ✅ Database passwords are not committed
- ✅ Cloudflare R2 credentials are not committed

