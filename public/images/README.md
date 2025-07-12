# Public Images Folder

Place images here that:
- Don't need any processing or optimization
- Will be served exactly as-is
- Need to be referenced by URL path

## Usage Example:

```astro
<!-- In any .astro file -->
<img src="/images/your-image.jpg" alt="Description" />

<!-- In React components -->
<img src="/images/your-image.jpg" alt="Description" />
```

## Supported Formats:
- .jpg / .jpeg
- .png
- .gif
- .svg
- .webp
- .avif

## Note:
Images in this folder are served directly from the root URL path.
For example: `/images/hero-bg.jpg`
