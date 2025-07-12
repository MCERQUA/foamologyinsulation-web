# 🖼️ Quick Image Replacement Guide

## Hero Background Image

**Current**: Using your provided image `Comfort-Insulation-Arizona-hero1.png`

**To change**: 
1. Add new image to `/src/assets/images/`
2. Edit `src/components/sections/Hero.astro` line 4:
   ```astro
   import heroImage from '@assets/images/YOUR-NEW-IMAGE.jpg';
   ```

## Blog Thumbnails

**Current**: Gradient placeholders

**To add real images**:
1. Add images to `/public/images/blog/`
2. Edit `src/components/sections/BlogSection.astro`
3. Replace the gradient div with:
   ```astro
   <img 
     src="/images/blog/your-blog-image.jpg" 
     alt="Blog post about insulation"
     class="w-full h-full object-cover rounded-2xl"
   />
   ```

## Service Icons/Images

**Current**: None (text only)

**To add**:
1. Add icons to `/public/images/services/`
2. Edit `src/components/sections/Services.astro`
3. Add before the title:
   ```astro
   <img 
     src="/images/services/attic-icon.svg" 
     alt="Attic insulation"
     class="w-12 h-12 mb-4"
   />
   ```

## Logo/Favicon

**Current**: Simple house icon

**To replace**:
1. Replace `/public/favicon.svg` with your logo
2. For PNG favicon, also update `BaseLayout.astro`:
   ```html
   <link rel="icon" type="image/png" href="/favicon.png" />
   ```

## Adding a Gallery Section

If you want to add a project gallery:

```astro
---
// Create new file: src/components/sections/Gallery.astro
const projects = [
  { image: '/images/projects/project1.jpg', title: 'Attic Insulation' },
  { image: '/images/projects/project2.jpg', title: 'Wall Insulation' },
  // Add more...
];
---

<section class="section-padding bg-cream">
  <div class="container-padding max-w-7xl mx-auto">
    <h2 class="heading-lg text-espresso mb-8 text-center">Our Work</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div class="rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all">
          <img 
            src={project.image} 
            alt={project.title}
            class="w-full h-64 object-cover"
          />
          <div class="p-4 bg-soft-white">
            <h3 class="font-semibold text-espresso">{project.title}</h3>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

## Image Optimization Tips

1. **Formats**: Use WebP for best performance
2. **Sizes**: 
   - Hero: 1920x1080px minimum
   - Thumbnails: 800x600px
   - Icons: SVG or 128x128px PNG
3. **Tools**: 
   - [Squoosh.app](https://squoosh.app) for compression
   - [TinyPNG](https://tinypng.com) for PNG optimization
4. **Naming**: Use descriptive names like `attic-insulation-process.jpg`

## Quick Commands

```bash
# Copy images to public folder (Windows)
copy "C:\YourImageFolder\*.jpg" "public\images\"

# Copy images to assets folder (Windows)
copy "C:\YourImageFolder\hero.jpg" "src\assets\images\"
```

Remember: Images in `/public/` are served as-is, while images in `/src/assets/` are optimized by Astro! 📸
