# Assets Images Folder

Place images here that:
- Need optimization (Astro will optimize these automatically)
- Will be imported in your components
- Benefit from build-time processing

## Usage Example:

```astro
---
// In .astro files
import heroImage from '@assets/images/hero-bg.jpg';
---

<img src={heroImage.src} alt="Hero background" />

<!-- Or with Astro's Image component for optimization -->
<Image src={heroImage} alt="Hero background" />
```

```jsx
// In React components
import heroImage from '@assets/images/hero-bg.jpg';

<img src={heroImage.src} alt="Hero background" />
```

## Benefits:
- Automatic optimization
- TypeScript support
- Build-time processing
- Better performance

## Supported Formats:
- .jpg / .jpeg
- .png
- .gif
- .svg
- .webp
- .avif
