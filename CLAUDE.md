# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL REQUIREMENTS - READ FIRST 🚨

### ⚠️ FLOATING NAVBAR PADDING REQUIREMENT ⚠️

**ALL PAGES AND BLOG POSTS MUST HAVE `pt-24` PADDING AT THE TOP!**

The website uses a **floating navbar** positioned at `top-6`. Every page, hero section, and blog post layout **MUST** include `pt-24 pb-12` padding to prevent content from being hidden behind the navbar.

**Required on:**
- ✅ All pages in `src/pages/` (including blog pages)
- ✅ All service pages in `src/pages/services/`
- ✅ Blog layout (`src/layouts/BlogLayout.astro`)
- ✅ Any hero sections or first elements on pages

**Pattern:**
```astro
<section class="... pt-24 pb-12">
  <!-- Content here -->
</section>
```

**Why:**
- Navbar positioned at `top-6` (24px from top)
- Navbar height: ~72px
- Total space: 96px = `pt-24` (6rem)
- Bottom breathing room: `pb-12` (3rem)

**If you forget this, content will be hidden behind the navbar! This is NON-NEGOTIABLE.**

---

## Project Overview

This is a **spray foam insulation company website** built for Foamology Insulation (Alaska-based), owned by **Magnus Pedersen**. Business address: **901 E Klatt Road #6, Anchorage, AK 99515**. It's a modern, static site using **Astro v5**, **React**, and **Tailwind CSS** with glass morphism effects and a component-based architecture.

## Common Commands

### Development
```bash
npm run dev        # Start dev server (http://localhost:4321)
npm run build      # Build for production
npm run preview    # Preview production build
npm run fix        # Run fix script for upgrade issues
```

### Clean Install (if encountering errors)
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Architecture Overview

### Tech Stack
- **Framework**: Astro v5 (static site generation)
- **Integrations**: @astrojs/react, @astrojs/tailwind, @astrojs/mdx
- **UI Library**: React 18 (for interactive components)
- **Styling**: Tailwind CSS with custom Alaska/glacier-themed blue palette
- **Animations**: Framer Motion + Tailwind animations
- **Forms**: Netlify Forms (pre-configured)
- **Content**: Astro Content Collections (MDX blog posts)

### Directory Structure
```
src/
├── components/
│   ├── componentRegistry.ts      # Central registry of all components
│   ├── ui/                       # React components (glass effects)
│   │   ├── GlassButton.tsx
│   │   ├── GlassCard.tsx
│   │   ├── GlassNavbar.tsx
│   │   ├── FloatingContactButton.tsx
│   │   └── TestimonialCard.tsx
│   ├── sections/                 # Astro page sections
│   │   ├── Hero.astro
│   │   ├── Services.astro
│   │   ├── ContactForm.astro
│   │   ├── TestimonialSection.astro
│   │   └── Footer.astro
│   └── components/               # Special components
│       └── liquid-glass.tsx
├── layouts/
│   ├── BaseLayout.astro          # Main layout wrapper
│   └── BlogLayout.astro          # Blog post layout
├── pages/
│   ├── index.astro               # Homepage
│   ├── about.astro
│   ├── services.astro
│   ├── services/                 # Individual service pages
│   └── blog/
│       ├── index.astro           # Blog listing
│       └── [...slug].astro       # Dynamic blog routes
├── content/
│   ├── config.ts                 # Content collections schema
│   └── blog/                     # MDX blog posts
└── styles/
    └── global.css                # Global styles with Tailwind directives
```

## Key Architectural Patterns

### 1. Component Registry System
All components are tracked in `src/components/componentRegistry.ts`. This provides:
- Central documentation of components
- Props and usage information
- Path references
- Image asset tracking

When adding a new component, update the registry.

### 2. Astro + React Hybrid Approach
- **Astro components** (.astro): Static sections, layouts, and pages
- **React components** (.tsx): Interactive UI elements requiring client-side JavaScript
- React components must use `client:*` directives in Astro files:
  - `client:load` - Load immediately
  - `client:visible` - Load when visible
  - `client:idle` - Load when browser idle

### 3. Content Collections (Astro v5 API)
Blog posts use Astro Content Collections:
```typescript
// Get all blog posts
import { getCollection } from 'astro:content';
const posts = await getCollection('blog');

// Render a post
const { Content } = await post.render();
```

Schema is defined in `src/content/config.ts`.

### 4. Glass Morphism Design System
All glass effects use consistent patterns:
- `backdrop-blur-md` or `backdrop-blur-lg`
- Semi-transparent backgrounds with alpha
- Border styling with `border-white/20`
- Subtle shadows with `shadow-glass`

### 5. Alaska/Glacier Theme
The color palette uses blue tones (not brown/tan):
- **Primary**: Various shades of blue (`cream`, `sand`, `sand-dark`, `khaki`, `taupe`)
- **Text**: `espresso` (#1565C0 - deep blue), `charcoal` (#0D47A1 - navy)
- **Accent**: `sage-accent` (green for eco sections), `terra-cotta` (bright blue for CTAs)

Colors are defined in `tailwind.config.mjs`.

## Important Configuration Files

### astro.config.mjs
- Sets `output: 'static'` for static site generation
- Tailwind with `applyBaseStyles: false` (custom base styles in global.css)
- React and MDX integrations enabled

### tailwind.config.mjs
- Custom Alaska-themed color palette
- Custom animations: `float`, `glow`, `slide-up`, `fade-in`, `subtle-pulse`, `scroll`
- Custom shadows: `soft`, `medium`, `elegant`, `glass`
- Extended font family: Inter

### src/content/config.ts
- Blog collection schema with Zod validation
- Required fields: `title`, `description`, `pubDate`
- Optional fields: `author`, `tags`, `readTime`, `featuredImage`, `featuredImageAlt`

## Working with Components

### Adding a New React Component
1. Create component in `src/components/ui/ComponentName.tsx`
2. Export the component
3. Update `componentRegistry.ts` with component info
4. Use in Astro with appropriate `client:*` directive

### Adding a New Astro Section
1. Create section in `src/components/sections/SectionName.astro`
2. Update `componentRegistry.ts` with component info
3. Import and use in pages

### Adding a New Blog Post
1. Create `.mdx` file in `src/content/blog/`
2. Add frontmatter with required fields:
   ```yaml
   ---
   title: 'Post Title'
   description: 'Brief description'
   pubDate: 2024-01-20
   author: 'Author Name'
   tags: ['tag1', 'tag2']
   readTime: '5 min read'
   ---
   ```
3. Write content using Markdown and React components
4. Blog will automatically appear on `/blog` listing page

## Known Issues & Fixes

### PostCSS/Tailwind Import Errors
If you see PostCSS errors, the fix is already applied in `global.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
Not the old format: `@import "tailwindcss"`

### Astro v5 Content Collections
Always use the new API:
```typescript
import { getCollection } from 'astro:content';
// NOT: Astro.glob()
```

### Clean Install if Encountering Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Deployment

Site is configured for **Netlify** deployment:
- Contact form uses `netlify` attribute for Netlify Forms
- Static output mode for optimal performance
- Build command: `npm run build`
- Publish directory: `dist/`

Also compatible with Vercel or any static hosting service.

## Style Guidelines & Design System

### Glass Morphism System
This project uses a **consistent glass morphism design system** throughout. All glass components must follow these patterns:

#### Core Glass Effect Properties
```css
/* Base glass effect - used in global.css */
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
background: rgba(255, 255, 255, 0.85);
border: 1px solid rgba(200, 184, 158, 0.2);
box-shadow: 0 8px 32px 0 rgba(74, 63, 54, 0.08);
```

#### Glass Variants Available
1. **`.glass`** - Light glass with white background (default)
2. **`.glass-warm`** - Warm tinted glass with cream background
3. **`.glass-dark`** - Dark glass for navbar/hero sections
4. **`.glass-navbar`** - Enhanced navbar glass with saturation boost

Always use these classes from `global.css` OR replicate the exact pattern in inline styles.

### Quick Reference Table

| Element Type | Background | Blur | Border | Border Radius | Padding |
|-------------|------------|------|---------|---------------|---------|
| **Card** | `bg-soft-white/80` | `blur(12px)` | `border-white/20` | `rounded-3xl` | `p-6 sm:p-8` |
| **Button** | `bg-terra-cotta/60` | `blur-md` | `border-terra-cotta/20` | `rounded-full` | `px-8 py-3.5` |
| **Navbar** | `rgba(255,255,255,0.08)` | `blur(16px)` | `border-white/18` | `rounded-full` | `px-4 py-3` |
| **Input** | `bg-white/50` | `blur-sm` | `border-white/30` | `rounded-2xl` | `px-5 py-3` |
| **Modal** | `bg-white/60` | `blur-xl` | `border-white/30` | `rounded-3xl` | `p-8` |
| **Dropdown** | `rgba(255,255,255,0.12)` | `blur(20px)` | `border-white/20` | `rounded-2xl` | `p-4` |

### Glass Component Patterns

#### 1. GlassCard Pattern
```tsx
// Structure: Outer container → Gradient overlay → Content
<div className="relative overflow-hidden rounded-3xl p-6 bg-soft-white/80"
     style={{
       backdropFilter: 'blur(12px)',
       WebkitBackdropFilter: 'blur(12px)',
       boxShadow: '0 8px 32px rgba(74, 63, 54, 0.08)',
       border: '1px solid rgba(200, 184, 158, 0.2)',
     }}>
  {/* Gradient overlay */}
  <div className="absolute inset-0 z-0 opacity-30"
       style={{
         background: 'radial-gradient(circle at top right, rgba(250, 247, 242, 0.8), transparent 70%)',
       }} />

  {/* Content with z-10 */}
  <div className="relative z-10">{children}</div>
</div>
```

#### 2. GlassButton Pattern
```tsx
// Structure: Button → Light effect overlay → Content
<button className="relative backdrop-blur-md border rounded-full"
        style={{
          filter: 'drop-shadow(0 0 20px rgba(123, 167, 217, 0.4))',
          boxShadow: '0 0 30px rgba(123, 167, 217, 0.3)'
        }}>
  {/* Glass light effect */}
  <div className="absolute inset-0 z-0 rounded-full"
       style={{
         background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%)',
         boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
       }} />

  {/* Content */}
  <div className="relative z-10">{children}</div>
</button>
```

#### 3. GlassNavbar Pattern
```tsx
// Structure: Glow → Glass container → Light reflection → Nav items
<div className="relative">
  {/* Outer glow */}
  <div className="absolute inset-0 rounded-full opacity-30"
       style={{
         background: 'radial-gradient(circle at center, rgba(123, 167, 217, 0.2), transparent 70%)',
         filter: 'blur(20px)'
       }} />

  {/* Glass container */}
  <div className="relative rounded-full"
       style={{
         backgroundColor: 'rgba(255, 255, 255, 0.08)',
         backdropFilter: 'blur(16px) saturate(1.8)',
         WebkitBackdropFilter: 'blur(16px) saturate(1.8)',
         border: '1px solid rgba(255, 255, 255, 0.18)',
         boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12)'
       }}>
    {/* Inner light reflection */}
    <div className="absolute inset-0 rounded-full pointer-events-none"
         style={{
           background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 100%)'
         }} />

    {/* Nav items */}
    <div className="relative z-10">{navItems}</div>
  </div>
</div>
```

### Consistent Styling Patterns to Follow

#### Z-Index Hierarchy
- **Overlays/backgrounds**: `z-0`
- **Main content**: `z-10`
- **Floating elements** (contact button): `z-30`
- **Navbar**: `z-40` (background), `z-50` (navbar itself)
- **Modals/dropdowns**: `z-50` (modals), `z-40` (backdrop)

#### Rounded Corners
- **Cards**: `rounded-3xl` (1.5rem)
- **Buttons**: `rounded-full`
- **Inputs**: `rounded-2xl` (1rem)
- **Panels**: `rounded-2xl` to `rounded-3xl`

#### Spacing
- **Section padding**: `py-16 sm:py-20 lg:py-24`
- **Container padding**: `px-4 sm:px-6 lg:px-8`
- **Card padding**: `p-6 sm:p-8`
- **Button padding**:
  - Small: `px-6 py-2.5`
  - Medium: `px-8 py-3.5`
  - Large: `px-10 py-4`

#### Hero Section Padding (Floating Navbar Compensation)
**CRITICAL DESIGN PATTERN**: Because the navigation menu is a floating component positioned at `top-6`, all hero sections MUST include `pt-24 pb-12` padding to prevent content from being hidden behind the navbar.

**Required Pattern for All Service Pages and Hero Sections:**
```astro
<section class="... pt-24 pb-12">
  <!-- Hero content -->
</section>
```

**Why This Matters:**
- Floating navbar has `top-6` (1.5rem = 24px from top)
- Navbar itself is approximately 72px tall
- Total space needed: ~96px (24px top spacing + 72px navbar height)
- `pt-24` = 6rem = 96px provides exact compensation
- `pb-12` = 3rem = 48px provides visual breathing room at bottom

**Pages That MUST Have This Padding:**
- All pages in `src/pages/services/` directory
- Any page with a hero section as the first element
- Any page where content could overlap with the fixed navbar

**Reference Examples:**
- `src/pages/services/crawl-space-insulation.astro` (has correct padding)
- `src/pages/services/weatherization.astro` (has correct padding)

#### Text Shadows (for readability over images)
```css
/* Heavy shadow for hero/navbar text */
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.6);

/* Medium shadow for headers */
text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);

/* Light shadow for body text */
text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
```

#### Drop Shadows (for glowing effects)
```css
/* Button glow */
filter: drop-shadow(0 0 20px rgba(123, 167, 217, 0.4)) drop-shadow(0 0 40px rgba(123, 167, 217, 0.2));

/* Logo glow */
filter: brightness(1.2) drop-shadow(0 0 20px rgba(255, 255, 255, 0.4));

/* Icon shadow */
filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.8));
```

#### Transitions
Always use smooth transitions for interactive elements:
```tsx
className="transition-all duration-300"
// For hover effects:
className="hover:scale-105 hover:-translate-y-1 transition-all duration-300"
```

### Color Usage Guidelines

#### Background Colors (with transparency for glass effects)
- **Light cards**: `bg-soft-white/80` or `bg-cream/90`
- **White cards**: `bg-white/95`
- **Form inputs**: `bg-white/50` → `focus:bg-white/70`
- **Navbar**: `rgba(255, 255, 255, 0.08)` (very transparent)
- **Dropdowns**: `rgba(255, 255, 255, 0.12)` (slightly more opaque)

#### Text Colors
- **Primary text**: `text-espresso` (#1565C0 - deep blue)
- **Headings**: `text-charcoal` (#0D47A1 - navy blue)
- **Light text on dark**: `text-soft-white` or `text-white/90`
- **Secondary text**: `text-warm-gray` or `text-espresso/70`
- **Placeholder text**: `placeholder-espresso/60`

#### Accent Colors
- **Primary CTA buttons**: `bg-terra-cotta/60` (bright blue)
- **Secondary buttons**: `bg-khaki/60` (medium blue)
- **Eco/savings sections**: `sage-accent` or `sage-mist` (green)
- **Hover states**: Add `/70` or `/80` opacity to base color

#### Border Colors
- **Glass borders**: `border-white/20` or `border-white/30`
- **Input borders**: `border-white/30` → `focus:border-sage-mist/50`
- **Navbar borders**: `border-white/18`

### Form Input Pattern
All form inputs must follow this pattern for consistency:
```tsx
<input
  className="
    w-full pl-12 pr-4 py-4
    bg-white/50 backdrop-blur-sm rounded-2xl
    border border-white/30
    text-espresso placeholder-espresso/60
    focus:bg-white/70 focus:border-sage-mist/50
    focus:outline-none focus:ring-2 focus:ring-sage-mist/20
    transition-all duration-200
  "
/>
```

### Hover Effects
All interactive elements should have these hover states:
- **Scale up**: `hover:scale-105` or `hover:scale-110`
- **Translate up**: `hover:-translate-y-1` or `hover:-translate-y-0.5`
- **Background opacity**: `hover:bg-white/70` (increase opacity)
- **Shadow increase**: `hover:shadow-xl`
- **Duration**: Always `duration-300` or `duration-200`

### Animation Classes Available
From `tailwind.config.mjs`:
- `animate-float` - Floating up/down motion (6s)
- `animate-glow` - Pulsing glow effect (2s)
- `animate-slide-up` - Slide in from bottom (0.5s)
- `animate-fade-in` - Fade in (0.8s)
- `animate-subtle-pulse` - Subtle opacity pulse (3s)
- `animate-scroll` - Horizontal scroll (30s)

### Component Files
- Keep files under 200 lines where possible
- Use TypeScript for React components
- Use descriptive prop types
- Add comments for complex logic
- Always wrap glass components in relative container with z-index layers

### Responsive Design
- Mobile-first approach
- Test at breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Use Tailwind responsive prefixes: `md:`, `lg:`, etc.
- Adjust padding: `p-6 sm:p-8` for cards, `px-2 sm:px-3` for buttons

### Animation Performance
- Prefer `transform` and `opacity` for animations
- Use `will-change` sparingly
- Test performance on lower-end devices
- Use `backdrop-filter` with `-webkit-backdrop-filter` fallback

## Maintaining Consistent Styling - Critical Rules

### When Creating New Components

1. **Always start with a glass pattern** from the examples above (GlassCard, GlassButton, or GlassNavbar)
2. **Follow the z-index hierarchy** - Background at z-0, content at z-10
3. **Use consistent spacing** - Don't create custom padding values, use the defined scale
4. **Match border radius** - Cards use `rounded-3xl`, buttons use `rounded-full`
5. **Copy shadow patterns** - Don't create new shadow values, use existing ones
6. **Use color palette** - Never use arbitrary colors, only colors from `tailwind.config.mjs`

### When Modifying Existing Components

1. **Check componentRegistry.ts first** - See if a similar component already exists
2. **Preserve the glass structure** - Don't remove the overlay/content z-index pattern
3. **Keep hover effects consistent** - Scale + translate + duration-300
4. **Don't change blur amounts** unless absolutely necessary (stick to blur-12px or blur-16px)
5. **Test on mobile** - All changes must work on mobile screens

### Common Mistakes to Avoid

❌ **Don't do this:**
```tsx
// Arbitrary colors
className="bg-blue-500"

// Custom padding not in scale
className="px-7 py-3.5"

// Missing webkit prefix
style={{ backdropFilter: 'blur(10px)' }}

// No z-index layering
<div className="relative bg-white/80">
  {children}
</div>

// Inconsistent border radius
className="rounded-xl"
```

✅ **Do this instead:**
```tsx
// Palette colors with transparency
className="bg-terra-cotta/60"

// Standard spacing scale
className="px-8 py-3.5"

// Both prefixes
style={{
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)'
}}

// Proper z-index layering
<div className="relative bg-soft-white/80">
  <div className="absolute inset-0 z-0">{/* overlay */}</div>
  <div className="relative z-10">{children}</div>
</div>

// Standard border radius
className="rounded-3xl"
```

### Style Consistency Checklist

Before committing any styling changes, verify:
- [ ] Uses colors from the Alaska/glacier blue palette (no arbitrary colors)
- [ ] Follows glass morphism pattern with overlay → content structure
- [ ] Has proper z-index layering (z-0 for backgrounds, z-10 for content)
- [ ] Uses standard spacing values (no custom padding/margin values)
- [ ] Has webkit prefix for backdrop-filter
- [ ] Includes smooth transitions (duration-300 or duration-200)
- [ ] Uses standard border radius (rounded-3xl for cards, rounded-full for buttons)
- [ ] Has proper text shadows for readability over images
- [ ] Tested on mobile (responsive breakpoints work correctly)
- [ ] Matches existing component patterns (check similar components first)

## Testing Checklist
- [ ] All pages load without errors
- [ ] Navigation works on mobile and desktop
- [ ] Contact form submits correctly
- [ ] Blog posts render with correct formatting
- [ ] Images load properly
- [ ] Glass effects render correctly across browsers (check Safari webkit prefixes)
- [ ] Animations perform smoothly
- [ ] All styling follows the design system patterns above

## Project-Specific Notes

### Services Pages
There are individual service pages in `src/pages/services/`:
- `spray-foam.astro`
- `crawl-space-insulation.astro`
- `thermal-inspections.astro`
- `insulation-removal.astro`

These should maintain consistent styling with the main services page.

### Ice Dam Prevention
Special page at `src/pages/ice-dam-prevention.astro` - Alaska-specific content.

### Gallery Images & Processing

#### Gallery System
The project has a fully functional gallery page at `/gallery` with:
- 58 SEO-optimized project images
- Category filtering (7 categories: spray-foam, crawlspace, commercial, air-sealing, ice-dam-prevention, thermal-inspections, other-services)
- Lightbox modal with keyboard navigation
- WebP support with JPG fallback for older browsers

#### Image Processing Scripts
Located in project root:

1. **`process-gallery-images.py`** - Renames and categorizes images
   - Generates SEO-friendly filenames
   - Creates `src/data/gallery-images.ts` and `public/gallery-manifest.json`
   - Already completed for 58 images

2. **`convert-heic-to-jpg.py`** - Converts HEIC to actual JPG format
   - **CRITICAL**: 55 files currently have `.jpg` extension but are HEIC format internally
   - Requires: `pillow` and `pillow-heif` packages
   - Must run before WebP conversion

3. **`convert-to-webp.py`** - Converts JPG to WebP format
   - Reduces file size by 25-35%
   - Requires: `webp` tools (cwebp command)
   - 6 files already converted successfully

#### Current Status
- ✅ 58 images renamed and organized
- ⚠️ **CRITICAL**: 55 files need HEIC → JPG conversion
- ✅ 6 files successfully converted to WebP
- ⚠️ 55 files pending WebP conversion (after HEIC conversion)

See `GALLERY_IMAGES_README.md` and `HEIC_CONVERSION_INSTRUCTIONS.md` for detailed instructions.

#### Adding New Images
When adding new project photos:
1. Save with descriptive name: `{location}-{service}-{detail}.jpg`
2. Ensure it's actual JPG format (not HEIC)
3. Add entry to `src/data/gallery-images.ts`:
   ```typescript
   {
     src: "/gallery/your-image.jpg",
     alt: "Descriptive alt text with Alaska/Anchorage keywords",
     category: "spray-foam" // or other category
   }
   ```
4. Run `python3 convert-to-webp.py` to create WebP version

#### Gallery Component
- Located at: `src/components/ui/GalleryGrid.tsx`
- Uses `<picture>` element for automatic WebP/JPG selection
- Supports category filtering with glass-styled filter buttons
- Mobile-responsive with touch gestures
- SEO-optimized with proper alt text on all images

### Company Information
- **Business Name**: Foamology Insulation
- **Owner**: Magnus Pedersen
- **Address**: 901 E Klatt Road #6, Anchorage, AK 99515
- **Phone**: (907) 310-3000
- **Email**: info@foamologyinsulation.com
- **Service Area**: Anchorage, Mat-Su Valley, Kenai Peninsula Borough

### remember to PUSH TO GITHUB!!!
Per project instructions, always push changes to GitHub after completing work.
- DO NOT use emojis on the website they look childish only create professional stylish components and svg icons

### 🚨 FINAL REMINDER: FLOATING NAVBAR PADDING 🚨
**Every time you create or modify a page, CHECK FOR `pt-24` padding at the top!** This is the #1 most common mistake. The floating navbar will cover content without this padding.
- push to GITHUB  when updates are completed to the project