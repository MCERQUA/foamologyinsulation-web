#!/usr/bin/env python3
"""
Update gallery-images.ts with SEO-optimized WebP images
Categorize based on image names and content
"""

from pathlib import Path
import json

GALLERY_DIR = Path("public/gallery")
OUTPUT_FILE = Path("src/data/gallery-images.ts")

# Load the SEO mapping
with open(GALLERY_DIR / "seo-rename-mapping.json") as f:
    seo_mapping = json.load(f)

# Reverse mapping (new name -> old name for categorization hints)
reverse_mapping = {v: k for k, v in seo_mapping.items()}

# Categorize images based on keywords in SEO names
def categorize_image(filename):
    """Determine category based on filename keywords"""
    name_lower = filename.lower()

    # Category priority order (more specific first)
    if 'quonset' in name_lower or 'shipping-container' in name_lower or 'connex' in name_lower:
        return 'commercial'
    if 'ice-dam' in name_lower or 'vapor-barrier' in name_lower:
        return 'ice-dam-prevention'
    if 'thermal' in name_lower or 'heat-loss' in name_lower:
        return 'thermal-inspections'
    if 'removal' in name_lower:
        return 'other-services'
    if 'blown-in' in name_lower or 'cellulose' in name_lower:
        return 'other-services'
    if 'crawl' in name_lower or 'crawlspace' in name_lower:
        return 'crawlspace'
    if 'metal-building' in name_lower or 'pole-barn' in name_lower or 'warehouse' in name_lower or 'commercial' in name_lower or 'industrial' in name_lower or 'agricultural' in name_lower or 'steel' in name_lower:
        return 'commercial'
    if 'air-sealing' in name_lower:
        return 'air-sealing'
    if 'attic' in name_lower or 'roof' in name_lower or 'ceiling' in name_lower or 'cathedral' in name_lower:
        return 'spray-foam'
    if 'wall' in name_lower or 'basement' in name_lower or 'foundation' in name_lower or 'rim-joist' in name_lower:
        return 'spray-foam'

    # Default to spray-foam for general installation photos
    return 'spray-foam'

def generate_alt_text(filename):
    """Generate descriptive alt text from SEO filename"""
    # Remove numbers and extensions
    name = filename.replace('.webp', '').replace('-1', '').replace('-2', '').replace('-3', '')

    # Replace hyphens with spaces and capitalize
    words = name.split('-')
    alt = ' '.join(word.capitalize() for word in words)

    # Add context
    alt += " in Alaska"

    return alt

# Get all WebP files (excluding old ones)
webp_files = sorted([f.name for f in GALLERY_DIR.glob("*.webp") if not f.name.startswith(('Thermal Inspections', 'alaska-thermal-camera', 'anchorage-crawl-space', 'anchorage-thermal'))])

# Create image data
images = []
for filename in webp_files:
    category = categorize_image(filename)
    alt_text = generate_alt_text(filename)

    images.append({
        'src': f'/gallery/{filename}',
        'alt': alt_text,
        'category': category
    })

# Generate TypeScript content
ts_content = f'''// Gallery images data - SEO optimized WebP images
// Auto-generated from HEIC conversion and SEO renaming
// Total images: {len(images)}

export interface GalleryImage {{
  src: string;
  alt: string;
  category: 'spray-foam' | 'crawlspace' | 'commercial' | 'air-sealing' | 'ice-dam-prevention' | 'thermal-inspections' | 'other-services';
}}

export const galleryImages: GalleryImage[] = [
'''

# Add each image
for img in images:
    ts_content += f'''  {{
    src: '{img['src']}',
    alt: '{img['alt']}',
    category: '{img['category']}'
  }},
'''

ts_content += '];\n'

# Write to file
OUTPUT_FILE.write_text(ts_content)

print("=" * 70)
print("Gallery Data Updated")
print("=" * 70)
print(f"Total images: {len(images)}")
print(f"Output file: {OUTPUT_FILE}")
print()

# Category breakdown
from collections import Counter
category_counts = Counter(img['category'] for img in images)
print("Category breakdown:")
for category, count in sorted(category_counts.items()):
    print(f"  {category}: {count} images")

print()
print("✓ Gallery data file updated successfully!")
