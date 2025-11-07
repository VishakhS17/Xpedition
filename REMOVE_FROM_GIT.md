# Commands to Remove Files from Git Repository

Run these commands in your PowerShell terminal to remove the files from Git tracking:

```bash
# Remove all the documentation files (if they still exist in git)
git rm ADMIN_SETUP.md CLOUD_SETUP_RECOMMENDATIONS.md CLOUDINARY_ANALYSIS.md CLOUDINARY_CREDITS_CORRECTION.md DEPLOYMENT_GUIDE.md FINAL_RECOMMENDATION.md GIT_SETUP.md GITHUB_PUSH_INSTRUCTIONS.md IMAGE_OPTIMIZATION_EXPLAINED.md MANUAL_OPTIMIZATION_ANALYSIS.md NEON_R2_SETUP.md QUICK_START.md SETUP_CHECKLIST.md SETUP_GUIDE.md STRAPI_INTEGRATION_ANALYSIS.md

# Remove sensitive files (use --cached to keep locally, or just rm to delete)
git rm --cached "R2 API Key.txt" "USER API TOKEN.txt"

# Remove other files
git rm Todo.txt REMOVE_FILES.md

# Commit the removal
git commit -m "Remove unnecessary documentation and sensitive files"

# Push to GitHub
git push origin main
```

**Note:** If a file doesn't exist in the repository anymore, git will skip it automatically.

