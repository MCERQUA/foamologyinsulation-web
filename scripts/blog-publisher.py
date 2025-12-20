#!/usr/bin/env python3
"""
Blog Publisher for Foamology Insulation Website
Converts completed blog research (HTML) to live MDX blog posts

Uses BeautifulSoup for robust HTML parsing

Usage:
    python3 scripts/blog-publisher.py <blog-folder-name>

Example:
    python3 scripts/blog-publisher.py crawl-space-insulation-stop-cold-floors-now
"""

import sys
import os
import json
import re
import shutil
from pathlib import Path
from datetime import datetime
from html import unescape

try:
    from bs4 import BeautifulSoup, NavigableString
except ImportError:
    print("Error: BeautifulSoup not installed. Run: pip3 install beautifulsoup4")
    sys.exit(1)

# Project paths
PROJECT_ROOT = Path(__file__).parent.parent
RESEARCH_BASE = PROJECT_ROOT / "ai" / "knowledge" / "10-Blog-research"
CONTENT_BLOG = PROJECT_ROOT / "src" / "content" / "blog"
PUBLIC_IMAGES = PROJECT_ROOT / "public" / "images" / "blog"


def extract_metadata(research_folder: Path) -> dict:
    """Extract metadata from final-review-approved.json"""

    review_file = research_folder / "final-review-approved.json"
    if not review_file.exists():
        raise FileNotFoundError(f"Review file not found: {review_file}")

    with open(review_file) as f:
        data = json.load(f)

    article = data.get("article", {})
    review = data.get("review", {})
    images = data.get("images", [])

    # Check if approved
    if review.get("status") != "APPROVED":
        raise ValueError(f"Blog not approved. Status: {review.get('status')}")

    # Get tags from LSI keywords
    seo = data.get("seo_checklist", {})
    tags = seo.get("lsi_keywords_used", [])[:6]

    # Get featured image
    featured_img = None
    featured_alt = ""
    for img in images:
        if "featured" in img.get("filename", "").lower() or img.get("placement") == "Featured Image":
            featured_img = img.get("filename")
            featured_alt = img.get("alt", "")
            break

    if not featured_img and images:
        featured_img = images[0].get("filename")
        featured_alt = images[0].get("alt", "")

    return {
        "title": article.get("title", ""),
        "slug": article.get("slug", ""),
        "description": "",  # Will extract from HTML
        "pubDate": datetime.now().strftime("%Y-%m-%d"),
        "author": "Foamology Insulation Team",
        "tags": tags,
        "readTime": article.get("reading_time", "10 min read"),
        "featuredImage": f"/images/blog/{article.get('slug')}/{featured_img}" if featured_img else "",
        "featuredImageAlt": featured_alt,
    }


def extract_meta_description(soup: BeautifulSoup) -> str:
    """Extract meta description from HTML"""
    meta = soup.find('meta', attrs={'name': 'description'})
    if meta:
        return meta.get('content', '')
    return ""


def convert_element_to_mdx(element, depth=0) -> str:
    """Recursively convert an HTML element to MDX"""

    if isinstance(element, NavigableString):
        text = str(element)
        # Don't strip all whitespace - preserve meaningful spacing
        if text.strip():
            return text
        elif text == ' ':
            return ' '
        return ''

    tag = element.name
    if tag is None:
        return ''

    # Skip these elements entirely
    if tag in ['script', 'style', 'head', 'nav', 'meta', 'link']:
        return ''

    # Get classes
    classes = element.get('class', [])
    if isinstance(classes, str):
        classes = classes.split()

    # Skip article header (we use frontmatter)
    if tag == 'header' and 'article-header' in classes:
        return ''

    # Handle different element types
    content = ''

    # Stats card
    if 'stats-card' in classes or 'stats-grid' in classes:
        return convert_stats_card(element)

    # Info box / callout
    if any(c in classes for c in ['info-box', 'callout', 'tip-box', 'warning-box']):
        return convert_info_box(element, classes)

    # CTA block
    if any(c in classes for c in ['cta-block', 'cta-section']):
        return convert_cta_block(element)

    # Figure
    if tag == 'figure':
        return convert_figure(element)

    # Table
    if tag == 'table':
        return convert_table(element)

    # FAQ section
    if 'faq-section' in classes or 'faq-list' in classes:
        return convert_faq_section(element)

    # Recursively process children
    for child in element.children:
        content += convert_element_to_mdx(child, depth)

    # Format based on tag type
    if tag == 'article':
        return content

    if tag == 'section':
        return f'\n{content}\n'

    if tag == 'div':
        # Most divs just pass through
        return content

    # Headings
    if tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
        level = int(tag[1])
        text = element.get_text(strip=True)
        if text:
            return f'\n\n{"#" * level} {text}\n\n'
        return ''

    # Paragraphs
    if tag == 'p':
        text = content.strip()
        if text:
            return f'\n\n{text}\n'
        return ''

    # Lists
    if tag == 'ul':
        items = []
        for li in element.find_all('li', recursive=False):
            item_text = li.get_text(strip=True)
            if item_text:
                items.append(f'- {item_text}')
        if items:
            return '\n\n' + '\n'.join(items) + '\n'
        return ''

    if tag == 'ol':
        items = []
        for i, li in enumerate(element.find_all('li', recursive=False), 1):
            item_text = li.get_text(strip=True)
            if item_text:
                items.append(f'{i}. {item_text}')
        if items:
            return '\n\n' + '\n'.join(items) + '\n'
        return ''

    if tag == 'li':
        return content  # Handled by parent ul/ol

    # Links
    if tag == 'a':
        href = element.get('href', '')
        text = element.get_text(strip=True)
        if text and href:
            return f'[{text}]({href})'
        return text

    # Inline formatting
    if tag in ['strong', 'b']:
        text = element.get_text(strip=True)
        if text:
            return f'**{text}**'
        return ''

    if tag in ['em', 'i']:
        text = element.get_text(strip=True)
        if text:
            return f'*{text}*'
        return ''

    if tag == 'code':
        text = element.get_text(strip=True)
        if text:
            return f'`{text}`'
        return ''

    if tag == 'blockquote':
        text = element.get_text(strip=True)
        if text:
            lines = text.split('\n')
            return '\n\n' + '\n'.join(f'> {line}' for line in lines) + '\n'
        return ''

    if tag == 'br':
        return '\n'

    if tag == 'hr':
        return '\n\n---\n\n'

    # Span - just pass through content
    if tag == 'span':
        return content

    # Default: return content
    return content


def convert_stats_card(element) -> str:
    """Convert stats card to StatsCard component"""

    stats = []
    stat_items = element.find_all(class_='stat-item')

    for item in stat_items:
        value_el = item.find(class_='stat-value')
        label_el = item.find(class_='stat-label')
        desc_el = item.find(class_='stat-description')

        stat = {
            "value": value_el.get_text(strip=True) if value_el else "",
            "label": label_el.get_text(strip=True) if label_el else "",
            "description": desc_el.get_text(strip=True) if desc_el else ""
        }
        if stat["value"] and stat["label"]:
            stats.append(stat)

    if not stats:
        return ''

    title_el = element.find('h3') or element.find('h4')
    title = title_el.get_text(strip=True) if title_el else "Key Statistics at a Glance"

    stats_json = json.dumps(stats, indent=4)
    # Fix indentation for JSX
    stats_json = stats_json.replace('\n', '\n  ')

    return f'''

<StatsCard
  client:load
  title="{title}"
  stats={{{stats_json}}}
/>

'''


def convert_info_box(element, classes) -> str:
    """Convert info/callout box to InfoBox component"""

    # Determine variant
    variant = "info"
    if any(c in classes for c in ['tip', 'tip-box', 'success']):
        variant = "tip"
    elif any(c in classes for c in ['warning', 'warning-box', 'caution']):
        variant = "warning"
    elif any(c in classes for c in ['danger', 'error', 'danger-box']):
        variant = "danger"

    # Get title
    title_el = element.find(['h3', 'h4', 'strong'])
    title = ""
    if title_el:
        title = title_el.get_text(strip=True)
        title_el.decompose()  # Remove from content

    # Get content
    content = element.get_text(strip=True)

    if not content:
        return ''

    return f'''

<InfoBox variant="{variant}" title="{title}">
{content}
</InfoBox>

'''


def convert_cta_block(element) -> str:
    """Convert CTA block to CTABlock component"""

    title_el = element.find(['h2', 'h3', 'h4'])
    title = title_el.get_text(strip=True) if title_el else "Ready to Improve Your Home's Insulation?"

    desc_el = element.find('p')
    description = desc_el.get_text(strip=True) if desc_el else "Get a free quote from Alaska's spray foam experts."

    link_el = element.find('a')
    button_text = "Get Your Free Quote"
    button_link = "/about#contact-form"
    if link_el:
        button_text = link_el.get_text(strip=True) or button_text
        button_link = link_el.get('href', button_link)

    return f'''

<CTABlock
  client:load
  title="{title}"
  description="{description}"
  buttonText="{button_text}"
  buttonLink="{button_link}"
/>

'''


def convert_figure(element) -> str:
    """Convert figure to JSX figure element"""

    img = element.find('img')
    if not img:
        return ''

    src = img.get('src', '')
    alt = img.get('alt', '')
    loading = img.get('loading', 'lazy')

    figcaption = element.find('figcaption')
    caption = figcaption.get_text(strip=True) if figcaption else ''

    return f'''

<figure className="my-8">
  <img
    src="{src}"
    alt="{alt}"
    className="rounded-2xl shadow-lg w-full"
    loading="{loading}"
  />
  <figcaption className="text-center text-warm-gray text-sm mt-3 italic">
    {caption}
  </figcaption>
</figure>

'''


def convert_table(element) -> str:
    """Convert table to markdown table"""

    rows = element.find_all('tr')
    if not rows:
        return ''

    table_data = []
    for row in rows:
        cells = row.find_all(['th', 'td'])
        row_data = [cell.get_text(strip=True) for cell in cells]
        if row_data:
            table_data.append(row_data)

    if not table_data:
        return ''

    # Build markdown table
    md = '\n\n'

    # Header
    header = table_data[0]
    md += '| ' + ' | '.join(header) + ' |\n'
    md += '|' + '|'.join(['---' for _ in header]) + '|\n'

    # Body
    for row in table_data[1:]:
        # Pad row to match header length
        while len(row) < len(header):
            row.append('')
        md += '| ' + ' | '.join(row) + ' |\n'

    md += '\n'
    return md


def convert_faq_section(element) -> str:
    """Convert FAQ section to markdown"""

    md = '\n\n## Frequently Asked Questions\n\n'

    # Look for FAQ items (various possible structures)
    items = element.find_all(class_='faq-item') or element.find_all('details')

    for item in items:
        question_el = item.find(['h3', 'h4', 'summary', 'strong'])
        answer_el = item.find('p') or item.find(class_='faq-answer')

        if question_el:
            question = question_el.get_text(strip=True)
            md += f'### {question}\n\n'

            if answer_el:
                answer = answer_el.get_text(strip=True)
                md += f'{answer}\n\n'

    return md


def html_to_mdx(html_content: str, metadata: dict) -> str:
    """Convert HTML to MDX format"""

    soup = BeautifulSoup(html_content, 'html.parser')

    # Extract meta description if not set
    if not metadata.get("description"):
        metadata["description"] = extract_meta_description(soup)

    # Get article body
    article = soup.find('article') or soup.find('body') or soup

    # Convert to MDX
    content = convert_element_to_mdx(article)

    # Clean up the content
    content = clean_content(content, metadata['slug'])

    # Generate frontmatter
    frontmatter = generate_frontmatter(metadata)

    # Generate imports
    imports = '''
import StatsCard from '../../components/blog/StatsCard.tsx';
import InfoBox from '../../components/blog/InfoBox.tsx';
import CTABlock from '../../components/blog/CTABlock.tsx';
'''

    return f"{frontmatter}\n{imports}\n{content}"


def generate_frontmatter(metadata: dict) -> str:
    """Generate MDX frontmatter"""

    # Escape single quotes in strings
    title = metadata.get("title", "").replace("'", "\\'")
    desc = metadata.get("description", "").replace("'", "\\'")

    # Fix location references in description (Alaska, not Arizona)
    desc = desc.replace('Phoenix', 'Anchorage')
    desc = desc.replace('Arizona', 'Alaska')
    desc = desc.replace(' AZ ', ' AK ')
    alt = metadata.get("featuredImageAlt", "").replace("'", "\\'")
    tags = json.dumps(metadata.get("tags", []))

    return f"""---
title: '{title}'
description: '{desc}'
pubDate: {metadata.get("pubDate")}
author: '{metadata.get("author", "Foamology Insulation Team")}'
tags: {tags}
readTime: '{metadata.get("readTime", "10 min read")}'
featuredImage: '{metadata.get("featuredImage", "")}'
featuredImageAlt: '{alt}'
---"""


def clean_content(content: str, slug: str) -> str:
    """Clean up and normalize MDX content"""

    # Fix location references (this is Alaska, not Arizona)
    content = content.replace('Phoenix', 'Anchorage')
    content = content.replace('Arizona', 'Alaska')
    content = content.replace(' AZ ', ' AK ')
    content = content.replace('AZ,', 'AK,')
    content = content.replace('AZ.', 'AK.')
    content = content.replace('AZ Rebates', 'AK Rebates')
    content = content.replace('a Anchorage', 'an Anchorage')

    # Remove HTML comment text that got converted (like "Featured Image", "Introduction")
    content = re.sub(r'^\s*Featured Image\s*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*Introduction\s*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*Section:.*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*Key Statistics Card\s*$', '', content, flags=re.MULTILINE)

    # Fix image paths to use the blog's image folder
    content = re.sub(
        r'/images/blog/[^/]+/',
        f'/images/blog/{slug}/',
        content
    )

    # Fix multiple newlines (max 3)
    content = re.sub(r'\n{4,}', '\n\n\n', content)

    # Fix spacing around headers
    content = re.sub(r'\n(#{1,6})\s', r'\n\n\1 ', content)

    # Remove empty headers
    content = re.sub(r'\n#{1,6}\s*\n', '\n', content)

    # Fix link spacing [text](url) not [text] (url)
    content = re.sub(r'\]\s+\(', '](', content)

    # Convert HTML entities
    content = unescape(content)

    # Ensure content starts with content, not empty lines
    content = content.lstrip('\n')

    return content


def copy_images(research_folder: Path, slug: str) -> list:
    """Copy images from research folder to public images"""

    target_dir = PUBLIC_IMAGES / slug
    target_dir.mkdir(parents=True, exist_ok=True)

    copied = []

    # Check for images in article-design folder
    design_images = research_folder / "article-design" / "images"
    if design_images.exists():
        for img in design_images.iterdir():
            if img.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']:
                dest = target_dir / img.name
                shutil.copy2(img, dest)
                copied.append(str(dest))

    # Also check root of article-design
    design_root = research_folder / "article-design"
    if design_root.exists():
        for img in design_root.iterdir():
            if img.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']:
                dest = target_dir / img.name
                if not dest.exists():
                    shutil.copy2(img, dest)
                    copied.append(str(dest))

    return copied


def publish_blog(folder_name: str) -> dict:
    """Main function to publish a blog from research folder"""

    research_folder = RESEARCH_BASE / folder_name

    if not research_folder.exists():
        raise FileNotFoundError(f"Blog folder not found: {research_folder}")

    # Check for required files
    html_file = research_folder / "article-final.html"
    if not html_file.exists():
        raise FileNotFoundError(f"article-final.html not found in {research_folder}")

    print(f"Publishing blog: {folder_name}")
    print(f"Source: {research_folder}")

    # Extract metadata
    print("Extracting metadata...")
    metadata = extract_metadata(research_folder)
    print(f"  Title: {metadata['title']}")
    print(f"  Slug: {metadata['slug']}")

    # Read HTML content
    with open(html_file) as f:
        html_content = f.read()

    # Convert to MDX
    print("Converting HTML to MDX...")
    mdx_content = html_to_mdx(html_content, metadata)

    # Copy images
    print("Copying images...")
    copied_images = copy_images(research_folder, metadata['slug'])
    print(f"  Copied {len(copied_images)} images")

    # Write MDX file
    mdx_file = CONTENT_BLOG / f"{metadata['slug']}.mdx"
    print(f"Writing MDX to: {mdx_file}")

    with open(mdx_file, 'w') as f:
        f.write(mdx_content)

    print("\n" + "=" * 50)
    print("Blog published successfully!")
    print("=" * 50)
    print(f"  MDX file: {mdx_file}")
    print(f"  Images: {PUBLIC_IMAGES / metadata['slug']}")

    return {
        "success": True,
        "slug": metadata['slug'],
        "mdx_file": str(mdx_file),
        "images_copied": len(copied_images),
        "metadata": metadata
    }


def list_available_blogs() -> list:
    """List all available blog folders and their status"""

    blogs = []

    if not RESEARCH_BASE.exists():
        return blogs

    for folder in sorted(RESEARCH_BASE.iterdir()):
        if not folder.is_dir():
            continue

        status = "unknown"
        title = folder.name

        # Check for review file
        review_file = folder / "final-review-approved.json"
        if review_file.exists():
            try:
                with open(review_file) as f:
                    data = json.load(f)
                status = data.get("review", {}).get("status", "unknown")
                title = data.get("article", {}).get("title", folder.name)
            except:
                pass
        elif (folder / "article-final.html").exists():
            status = "READY (no review)"
        else:
            status = "IN PROGRESS"

        blogs.append({
            "folder": folder.name,
            "title": title,
            "status": status,
            "publishable": status == "APPROVED"
        })

    return blogs


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("=" * 60)
        print("  Blog Publisher for Foamology Insulation")
        print("=" * 60)
        print("\nUsage: python3 scripts/blog-publisher.py <folder-name>")
        print("\nAvailable blogs:\n")

        blogs = list_available_blogs()
        for blog in blogs:
            status_icon = "✓" if blog["publishable"] else "○"
            print(f"  {status_icon} {blog['folder']}")
            print(f"      {blog['status']}")

        print("\nExample:")
        print("  python3 scripts/blog-publisher.py crawl-space-insulation-stop-cold-floors-now")
        sys.exit(0)

    folder_name = sys.argv[1]

    try:
        result = publish_blog(folder_name)
        print("\nNext steps:")
        print("  1. Review the MDX file for any conversion issues")
        print("  2. Run 'npm run dev' to preview")
        print("  3. Test all links and images")
        print("  4. Git commit and push to deploy")
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
