#!/usr/bin/env python3
"""
Convert HEIC images to WebP format and rename with SEO-friendly names
for Foamology Insulation spray foam company in Alaska
"""

import os
import sys
from pathlib import Path
from PIL import Image
import pillow_heif
import json

# Register HEIC opener with Pillow
pillow_heif.register_heif_opener()

GALLERY_DIR = Path("public/gallery")
WEBP_QUALITY = 85

# SEO naming patterns based on image content analysis
# We'll analyze filenames and then manually review for better names
seo_patterns = {
    # Spray foam installation photos
    'closed cell': 'anchorage-closed-cell-spray-foam-installation',
    'open cell': 'alaska-open-cell-spray-foam-insulation',
    'spray foam': 'alaska-spray-foam-insulation-application',

    # Crawl space work
    'crawl': 'anchorage-crawl-space-spray-foam-insulation',
    'crawlspace': 'alaska-crawlspace-encapsulation-insulation',

    # Thermal inspections
    'thermal': 'anchorage-thermal-imaging-inspection',
    'heat loss': 'alaska-heat-loss-thermal-camera-detection',
    'infrared': 'anchorage-infrared-thermal-inspection',

    # Ice dam related
    'ice dam': 'alaska-ice-dam-prevention-spray-foam',
    'ice damming': 'anchorage-ice-dam-repair-insulation',
    'rotten': 'alaska-ice-dam-damage-roof-repair',

    # Vapor barrier issues
    'vapor barrier': 'alaska-vapor-barrier-air-sealing-installation',
    'missing vapor': 'anchorage-missing-vapor-barrier-heat-loss',
    'torn vapor': 'alaska-damaged-vapor-barrier-replacement',

    # Insulation removal
    'removal': 'anchorage-old-insulation-removal-service',
    'blow in': 'alaska-blown-in-cellulose-insulation-installation',

    # Commercial/specialty
    'metal building': 'anchorage-metal-building-spray-foam-insulation',
    'quonset': 'alaska-quonset-hut-spray-foam-specialists',
    'connex': 'anchorage-shipping-container-insulation-specialists',
    'commercial': 'alaska-commercial-spray-foam-insulation',

    # General installation
    'attic': 'anchorage-attic-spray-foam-insulation-installation',
    'wall': 'alaska-wall-spray-foam-insulation-application',
    'floor': 'anchorage-floor-spray-foam-insulation',
    'cantilever': 'alaska-cantilever-floor-spray-foam-insulation',
}

def convert_heic_to_webp(heic_path, webp_path):
    """Convert a HEIC image to WebP format"""
    try:
        # Open HEIC image
        img = Image.open(heic_path)

        # Convert to RGB if necessary
        if img.mode in ('RGBA', 'LA', 'P'):
            img = img.convert('RGB')

        # Save as WebP
        img.save(webp_path, 'WEBP', quality=WEBP_QUALITY, method=6)

        print(f"✓ Converted: {heic_path.name} -> {webp_path.name}")
        return True
    except Exception as e:
        print(f"✗ Failed to convert {heic_path.name}: {e}")
        return False

def suggest_seo_name(original_name):
    """Suggest SEO-friendly name based on original filename"""
    name_lower = original_name.lower()

    # Check for known patterns
    for pattern, seo_name in seo_patterns.items():
        if pattern in name_lower:
            return seo_name

    # Generic names based on IMG patterns
    if 'img_' in name_lower or name_lower.startswith('img'):
        return 'alaska-spray-foam-insulation-project'

    # Default
    return 'anchorage-spray-foam-insulation-service'

def main():
    """Main conversion process"""
    print("=" * 70)
    print("HEIC to WebP Conversion for Foamology Insulation")
    print("=" * 70)

    # Find all HEIC files
    heic_files = sorted(GALLERY_DIR.glob("*.HEIC"))

    if not heic_files:
        print("No HEIC files found in public/gallery/")
        return

    print(f"\nFound {len(heic_files)} HEIC files to convert\n")

    # Create temporary WebP directory
    temp_webp_dir = GALLERY_DIR / "webp_temp"
    temp_webp_dir.mkdir(exist_ok=True)

    conversion_results = []
    conversion_count = 0

    for heic_path in heic_files:
        # Create temporary WebP filename
        webp_name = heic_path.stem + '.webp'
        webp_path = temp_webp_dir / webp_name

        # Convert
        if convert_heic_to_webp(heic_path, webp_path):
            conversion_count += 1

            # Suggest SEO name
            suggested_name = suggest_seo_name(heic_path.stem)

            conversion_results.append({
                'original_heic': heic_path.name,
                'temp_webp': webp_name,
                'suggested_seo_name': suggested_name,
                'original_stem': heic_path.stem
            })

    print(f"\n{'=' * 70}")
    print(f"Conversion Complete: {conversion_count}/{len(heic_files)} successful")
    print(f"{'=' * 70}\n")

    # Save conversion mapping for review
    mapping_file = GALLERY_DIR / "conversion-mapping.json"
    with open(mapping_file, 'w') as f:
        json.dump(conversion_results, f, indent=2)

    print(f"Conversion mapping saved to: {mapping_file}")
    print(f"Temporary WebP files in: {temp_webp_dir}/")
    print("\nNext steps:")
    print("1. Review the images in webp_temp/ folder")
    print("2. Review conversion-mapping.json for SEO names")
    print("3. Run the rename script to apply SEO names")

    # Print summary of suggested names
    print("\n" + "=" * 70)
    print("SEO Name Suggestions Summary:")
    print("=" * 70)

    # Group by suggested name
    name_groups = {}
    for result in conversion_results:
        seo_name = result['suggested_seo_name']
        if seo_name not in name_groups:
            name_groups[seo_name] = []
        name_groups[seo_name].append(result['original_heic'])

    for seo_name, files in sorted(name_groups.items()):
        print(f"\n{seo_name}: ({len(files)} files)")
        for f in files[:3]:  # Show first 3
            print(f"  - {f}")
        if len(files) > 3:
            print(f"  ... and {len(files) - 3} more")

if __name__ == "__main__":
    main()
