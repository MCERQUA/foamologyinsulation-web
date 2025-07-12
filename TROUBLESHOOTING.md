# Troubleshooting Guide

## 🔧 Fix for PostCSS Error

The PostCSS error you're seeing is because of incorrect Tailwind CSS imports. I've already fixed this in the code.

### Quick Fix Steps:

1. **Stop the dev server** (Ctrl+C)

2. **Clear cache and reinstall**:
   ```bash
   # Windows
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   
   # OR Linux/Mac
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Start the dev server again**:
   ```bash
   npm run dev
   ```

### If Issues Persist:

1. **Check Node version** (should be 18+):
   ```bash
   node --version
   ```

2. **Try manual PostCSS install**:
   ```bash
   npm install -D postcss autoprefixer
   ```

3. **Alternative start command**:
   ```bash
   npx astro dev --verbose
   ```

## ✅ What Was Fixed:

- ✅ Changed `@import "tailwindcss"` to proper directives
- ✅ Updated blog pages for Astro v5 API
- ✅ Fixed content collection types
- ✅ Updated TypeScript config
- ✅ Fixed date formats in MDX

## 📝 Common Issues:

### Issue: "Unknown word" in PostCSS
**Solution**: This is fixed - just need to reinstall dependencies

### Issue: Content collections not working
**Solution**: Already updated to use new Astro v5 API

### Issue: React components not loading
**Solution**: Make sure `client:load` or `client:visible` directives are present

## 🚀 Fresh Start Command:
```bash
# One-liner to clean and restart
npm run fix || (rm -rf node_modules package-lock.json && npm install && npm run dev)
```

The site should now work with Astro v5! 🎉
