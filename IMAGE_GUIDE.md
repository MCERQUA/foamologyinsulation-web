# 📸 Image Usage Guide for ComfortCo Website

## Where to Put Images

### 1. **Public Images** (`/public/images/`)
Drop images here when you want to:
- Reference them by URL path
- Serve them as-is without optimization
- Use them in external links or meta tags

**Example usage:**
```astro
<img src="/images/comfort-hero.jpg" alt="Comfort living space" />
```

### 2. **Asset Images** (`/src/assets/images/`)
Drop images here when you want to:
- Optimize them automatically
- Import them in components
- Get TypeScript support
- Improve performance

**Example usage:**
```astro
---
import comfortHero from '@assets/images/comfort-hero.jpg';
---

<img src={comfortHero.src} alt="Comfort living space" />
```

## 🖼️ Replacing Placeholder Images

### Current Placeholder Locations:

1. **Hero Background** (`src/components/sections/Hero.astro`)
   - Currently using Unsplash URL
   - Replace with: `/images/hero-bg.jpg` after adding your image

2. **Blog Post Thumbnails** (`src/components/sections/BlogSection.astro`)
   - Currently using gradient placeholders
   - Add images to: `/public/images/blog/`

3. **Favicon** (`/public/favicon.svg`)
   - Replace with your logo

## 📝 Quick Examples

### Update Hero Background:
```astro
<!-- Before -->
style="background: url('https://images.unsplash.com/...')">

<!-- After -->
style="background: url('/images/hero-bg.jpg')">
```

### Add Blog Thumbnail:
```astro
<!-- Replace gradient div with: -->
<img 
  src="/images/blog/comfort-spaces-thumb.jpg" 
  alt="Comfortable living spaces"
  class="w-full h-full object-cover rounded-2xl"
/>
```

### Using Optimized Images:
```astro
---
// At the top of any .astro file
import { Image } from 'astro:assets';
import heroImage from '@assets/images/hero-bg.jpg';
---

<Image 
  src={heroImage} 
  alt="Hero background"
  width={1920}
  height={1080}
  quality={80}
/>
```

## 🎨 Recommended Image Specs

- **Hero Images**: 1920x1080px (or larger)
- **Blog Thumbnails**: 800x600px
- **Card Images**: 600x400px
- **Icons**: SVG format preferred
- **Formats**: WebP for best performance, JPEG for photos, PNG for transparency

## 📁 Folder Structure
```
comfort-website/
├── public/
│   └── images/
│       ├── hero-bg.jpg
│       ├── logo.svg
│       └── blog/
│           ├── post-1-thumb.jpg
│           └── post-2-thumb.jpg
└── src/
    └── assets/
        └── images/
            ├── optimized-hero.jpg
            └── team/
                └── member-1.jpg
```

## 🚀 Pro Tips

1. **Use WebP format** for better performance
2. **Optimize images** before uploading (tools: TinyPNG, Squoosh)
3. **Use descriptive filenames** (e.g., `modern-living-room.jpg` not `IMG_1234.jpg`)
4. **Add alt text** for accessibility
5. **Lazy load** images below the fold with `loading="lazy"`

Happy image uploading! 🎉
