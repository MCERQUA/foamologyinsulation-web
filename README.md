# ComfortCo Website

A modern, mobile-first website built with Astro, React, and Tailwind CSS featuring glass morphism effects and a component-based architecture.

## 🚀 Project Structure

```
comfort-website/
├── public/
│   └── (static assets)
├── src/
│   ├── components/
│   │   ├── componentRegistry.ts    # Central component index
│   │   ├── ui/                     # Reusable UI components
│   │   │   ├── GlassButton.tsx
│   │   │   ├── GlassCard.tsx
│   │   │   ├── GlassFilter.tsx
│   │   │   ├── GlassNavbar.tsx
│   │   │   └── FloatingContactButton.tsx
│   │   └── sections/               # Page section components
│   │       ├── Hero.astro
│   │       ├── BlogSection.astro
│   │       ├── ContactForm.astro
│   │       └── Footer.astro
│   ├── content/
│   │   ├── config.ts              # Content collections config
│   │   └── blog/                  # Blog posts (MDX)
│   │       └── first-blog.mdx
│   ├── layouts/
│   │   ├── BaseLayout.astro      # Main layout wrapper
│   │   └── BlogLayout.astro      # Blog post layout
│   ├── pages/
│   │   ├── index.astro           # Home page
│   │   └── blog/
│   │       ├── index.astro       # Blog listing
│   │       └── [...slug].astro   # Dynamic blog pages
│   └── styles/
│       └── global.css            # Global styles
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## 🧩 Component System

The project uses a centralized component registry (`componentRegistry.ts`) to track all available components:

```typescript
import { componentRegistry, getComponentInfo, listComponents } from '@components/componentRegistry';

// Get info about a specific component
const heroInfo = getComponentInfo('sections', 'Hero');

// List all components in a category
const uiComponents = listComponents('ui');
```

### Adding New Components

1. Create the component file in the appropriate directory
2. Update `componentRegistry.ts` with the component info
3. Import and use the component where needed

## 🎨 Design System

### Colors
- **Soft Sand**: #F0EDE6
- **Warm Sand**: #DED5C2
- **Sands Stone**: #CBB79E
- **Sage Mist**: #B0B99B
- **Slate Cloud**: #78C399

### Typography
- Font: Inter (Regular 400, Bold 700)

### Effects
- Glass morphism with colored tints
- Smooth animations and transitions
- Mobile-first responsive design
- Modern glow and shadow effects

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Key Features

- **Glass Effect Components**: Beautiful glass morphism UI elements
- **Component-Based Architecture**: Modular, reusable components
- **Mobile-First Design**: Optimized for all screen sizes
- **Netlify Forms**: Built-in contact form integration
- **MDX Blog**: Rich content authoring with React components
- **Performance Optimized**: Static site generation with Astro
- **TypeScript**: Full type safety throughout the project

## 🔧 Configuration

### Netlify Deployment

The contact form is pre-configured for Netlify Forms. Simply deploy to Netlify and forms will work automatically.

### Adding Blog Posts

1. Create a new `.mdx` file in `src/content/blog/`
2. Add frontmatter with required fields:
   ```yaml
   ---
   title: 'Your Post Title'
   description: 'Brief description'
   pubDate: 2024-01-20
   author: 'Author Name'
   tags: ['tag1', 'tag2']
   readTime: '5 min read'
   ---
   ```
3. Write your content using Markdown and React components

## 📱 Mobile Optimization

- Responsive navigation with mobile menu
- Touch-friendly interactive elements
- Optimized font sizes and spacing
- Floating contact button for easy access
- Performance-optimized images and assets
