# Publish Blog from Research Folder

Publish a completed blog article from the research folder to the live website.

## Usage

```
/publish-blog <folder-name>
```

Where `<folder-name>` is one of the completed blog research folders in `ai/knowledge/10-Blog-research/`

## Available Blogs to Publish

List folders in `ai/knowledge/10-Blog-research/` to see available blogs:
- Each folder with `article-final.html` and `final-review-approved.json` with `status: "APPROVED"` is ready

## What This Command Does

1. **Validates** the blog is approved (checks `final-review-approved.json`)
2. **Extracts metadata** from `final-review-approved.json`:
   - Title, description, slug
   - Tags, read time, author
   - Featured image info
3. **Converts** `article-final.html` to MDX format:
   - Generates proper frontmatter
   - Converts HTML to JSX syntax (class → className, etc.)
   - Imports blog components (StatsCard, InfoBox, CTABlock)
   - Handles tables, figures, and semantic HTML
4. **Processes images**:
   - Copies images from research folder to `public/images/blog/{slug}/`
   - Updates image paths in content
5. **Creates** the MDX file in `src/content/blog/{slug}.mdx`
6. **Generates** schema markup if not present
7. **Runs** build test to verify no errors

## Requirements for a Blog to be Publishable

The blog research folder MUST have:
- `article-final.html` - The completed HTML article
- `final-review-approved.json` - With `review.status: "APPROVED"`
- `article-design/` folder with generated images (if any)

## Example

```
/publish-blog crawl-space-insulation-stop-cold-floors-now
```

## Post-Publish Steps

After running this command:
1. Review the generated MDX at `src/content/blog/{slug}.mdx`
2. Run `npm run dev` to preview locally
3. Test all internal and external links
4. Git commit and push to deploy

## Conversion Process

The blog publisher script handles these conversions:

### HTML → MDX Conversions
- `<article>` → removed (content only)
- `<header>` meta → frontmatter
- `<section class="stats-card">` → `<StatsCard>` component
- `<div class="info-box">` → `<InfoBox>` component
- `<div class="cta-block">` → `<CTABlock>` component
- `class=` → `className=`
- `<table>` → preserved for Markdown tables or styled components
- `<figure>/<figcaption>` → JSX syntax
- Smart quotes and entities → proper UTF-8

### Frontmatter Generation
```yaml
---
title: 'Title from final-review-approved.json'
description: 'Meta description from HTML'
pubDate: YYYY-MM-DD
author: 'Author from meta'
tags: ['tag1', 'tag2', ...]
readTime: 'X min read'
featuredImage: '/images/blog/{slug}/01-featured-hero.jpg'
featuredImageAlt: 'Alt text from img'
---
```

## Troubleshooting

**"Blog not approved"** - Check that `final-review-approved.json` has `review.status: "APPROVED"`

**"Missing article-final.html"** - The blog isn't complete yet; run the blog writing pipeline first

**"Image not found"** - Ensure images are in `article-design/images/` folder

**Build errors after publishing** - Check MDX syntax; JSX requires self-closing tags and className

## Now Execute

To publish the blog, Claude should:

1. First, list available blogs:
```bash
ls -la ai/knowledge/10-Blog-research/
```

2. For the specified blog folder, check if ready:
```bash
cat ai/knowledge/10-Blog-research/$BLOG_FOLDER/final-review-approved.json | grep -A1 '"status"'
```

3. Run the publish script:
```bash
python3 scripts/blog-publisher.py $BLOG_FOLDER
```

4. If script doesn't exist yet, CREATE it first at `scripts/blog-publisher.py`

5. After publishing, verify:
```bash
ls -la src/content/blog/*.mdx
npm run build 2>&1 | head -50
```

---

$ARGUMENTS
