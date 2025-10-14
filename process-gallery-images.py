#!/usr/bin/env python3
"""
Process gallery images: rename with SEO-friendly names and prepare manifest
"""
import os
import shutil
from pathlib import Path

# Gallery source directory
GALLERY_DIR = Path("/mnt/HC_Volume_103321268/isolated-projects/foamologyinsulation-web/public/gallery")

# Image mapping with SEO-friendly names and categories
# Format: (original_name, new_name, category, alt_text)
IMAGE_MAPPINGS = [
    # Air Sealing & Problem Solving
    ("Missing vapor Barrier causing heat loss", "anchorage-vapor-barrier-heat-loss-repair.jpg", "air-sealing", "Vapor barrier heat loss repair in Anchorage Alaska home"),
    ("Missing_Torn Vapor barrier causing ice damming", "alaska-torn-vapor-barrier-ice-dam-prevention.jpg", "air-sealing", "Torn vapor barrier causing ice damming in Alaska home"),
    ("Torn Vapor Barrier around light fixtures causing heatloss", "anchorage-light-fixture-air-sealing-vapor-barrier.jpg", "air-sealing", "Air sealing around light fixtures preventing heat loss Anchorage"),
    ("Cold floors at cantilevers Fix", "anchorage-cantilever-insulation-cold-floor-solution.jpg", "air-sealing", "Cantilever insulation solution for cold floors Anchorage Alaska"),

    # Ice Damming & Roof Issues
    ("Rotten roof decking as a result from ice damming", "alaska-ice-dam-roof-damage-repair.jpg", "ice-dam-prevention", "Ice dam roof damage and decking repair Anchorage Alaska"),
    ("Heat Loss example", "anchorage-thermal-imaging-heat-loss-detection.jpg", "thermal-inspections", "Thermal imaging showing heat loss in Alaska home"),

    # Closed Cell Spray Foam (2lb)
    ("Closed Cell Foam", "anchorage-2lb-closed-cell-spray-foam-installation.jpg", "spray-foam", "2lb closed cell spray foam insulation installation Anchorage"),
    ("IMG_0117.HEIC", "alaska-closed-cell-foam-attic-insulation.jpg", "spray-foam", "Closed cell spray foam attic insulation Alaska"),
    ("IMG_3235.HEIC", "anchorage-spray-foam-insulation-application.jpg", "spray-foam", "Professional spray foam insulation application Anchorage"),
    ("IMG_3245.HEIC", "alaska-closed-cell-foam-installation-progress.jpg", "spray-foam", "Closed cell foam installation in progress Alaska"),
    ("IMG_4195.HEIC", "anchorage-commercial-spray-foam-project.jpg", "spray-foam", "Commercial spray foam insulation project Anchorage"),
    ("IMG_4215.HEIC", "alaska-residential-spray-foam-insulation.jpg", "spray-foam", "Residential spray foam insulation Alaska home"),
    ("IMG_4216.HEIC", "anchorage-attic-spray-foam-complete.jpg", "spray-foam", "Complete attic spray foam insulation Anchorage"),
    ("IMG_4219.HEIC", "alaska-crawlspace-spray-foam-application.jpg", "crawlspace", "Crawl space spray foam insulation Alaska"),

    # Crawlspace Projects
    ("Crawlspace Insulation", "anchorage-crawlspace-insulation-2lb-foam.jpg", "crawlspace", "Crawl space insulation with 2lb closed cell foam Anchorage"),
    ("Crawlspace Insulation(1)", "alaska-crawlspace-spray-foam-complete.jpg", "crawlspace", "Completed crawl space spray foam insulation Alaska"),
    ("Crawlspace Insulation.jpg", "anchorage-crawl-space-insulation-before-after.jpg", "crawlspace", "Crawl space insulation transformation Anchorage Alaska"),
    ("IMG_5597.HEIC", "alaska-crawlspace-vapor-barrier-insulation.jpg", "crawlspace", "Crawl space vapor barrier and insulation Alaska"),
    ("IMG_5600.HEIC", "anchorage-crawlspace-foundation-insulation.jpg", "crawlspace", "Foundation and crawl space insulation Anchorage"),

    # Metal Buildings & Commercial
    ("Connex Insulation", "anchorage-shipping-container-spray-foam-insulation.jpg", "commercial", "Shipping container insulation with spray foam Anchorage"),
    ("Connex Insulation(1)", "alaska-connex-container-insulation-project.jpg", "commercial", "Connex container insulation project Alaska"),
    ("Metal Building Insulation_", "anchorage-metal-building-spray-foam-insulation.jpg", "commercial", "Metal building spray foam insulation Anchorage Alaska"),
    ("Metal Building Specialists", "alaska-commercial-metal-building-insulation.jpg", "commercial", "Commercial metal building insulation specialists Alaska"),
    ("Quonset Hut Insulation", "anchorage-quonset-hut-spray-foam-insulation.jpg", "commercial", "Quonset hut spray foam insulation Anchorage"),
    ("Quonset Hut Insulation(1)", "alaska-quonset-hut-insulation-complete.jpg", "commercial", "Completed quonset hut insulation Alaska"),
    ("Quonset Hut Specialists", "anchorage-quonset-hut-insulation-experts.jpg", "commercial", "Quonset hut insulation specialists Anchorage Alaska"),

    # Blow-in & Other Insulation
    ("Blow in Insulation", "anchorage-blow-in-insulation-application.jpg", "other-services", "Blow-in insulation application Anchorage Alaska"),
    ("Blow in_", "alaska-blown-insulation-attic-upgrade.jpg", "other-services", "Blown insulation attic upgrade Alaska"),
    ("Insulation Removal", "anchorage-old-insulation-removal-service.jpg", "other-services", "Old insulation removal service Anchorage Alaska"),

    # Thermal Inspections
    ("Thermal Inspections.jpg", "anchorage-thermal-imaging-inspection-service.jpg", "thermal-inspections", "Professional thermal imaging inspection Anchorage Alaska"),
    ("IMG_4598.JPG", "alaska-thermal-camera-energy-audit.jpg", "thermal-inspections", "Thermal camera energy audit Alaska home"),

    # Additional spray foam projects
    ("IMG_0641.HEIC", "anchorage-garage-spray-foam-insulation.jpg", "spray-foam", "Garage spray foam insulation Anchorage"),
    ("IMG_4271.HEIC", "alaska-basement-spray-foam-application.jpg", "spray-foam", "Basement spray foam insulation Alaska"),
    ("IMG_5616.HEIC", "anchorage-rim-joist-spray-foam-sealing.jpg", "spray-foam", "Rim joist air sealing with spray foam Anchorage"),
    ("IMG_5651.HEIC", "alaska-wall-cavity-spray-foam-insulation.jpg", "spray-foam", "Wall cavity spray foam insulation Alaska"),
    ("IMG_5674.HEIC", "anchorage-closed-cell-foam-ceiling-application.jpg", "spray-foam", "Closed cell foam ceiling application Anchorage"),
    ("IMG_5679.HEIC", "alaska-spray-foam-insulation-detail-work.jpg", "spray-foam", "Detail spray foam insulation work Alaska"),
    ("IMG_5759.HEIC", "anchorage-commercial-warehouse-foam-insulation.jpg", "commercial", "Commercial warehouse foam insulation Anchorage"),
    ("IMG_5760.HEIC", "alaska-industrial-spray-foam-project.jpg", "commercial", "Industrial spray foam insulation project Alaska"),
    ("IMG_5762.HEIC", "anchorage-building-envelope-spray-foam.jpg", "spray-foam", "Building envelope spray foam insulation Anchorage"),
    ("IMG_5764.HEIC", "alaska-attic-rafters-spray-foam-insulation.jpg", "spray-foam", "Attic rafter spray foam insulation Alaska"),
    ("IMG_5765.HEIC", "anchorage-cathedral-ceiling-foam-insulation.jpg", "spray-foam", "Cathedral ceiling foam insulation Anchorage"),
    ("IMG_5766.HEIC", "alaska-vaulted-ceiling-spray-foam.jpg", "spray-foam", "Vaulted ceiling spray foam insulation Alaska"),
    ("IMG_5767.HEIC", "anchorage-roof-deck-spray-foam-application.jpg", "spray-foam", "Roof deck spray foam application Anchorage"),
    ("IMG_5768.HEIC", "alaska-new-construction-spray-foam.jpg", "spray-foam", "New construction spray foam insulation Alaska"),
    ("IMG_5770.HEIC", "anchorage-open-beam-ceiling-insulation.jpg", "spray-foam", "Open beam ceiling spray foam Anchorage"),
    ("IMG_5771.HEIC", "alaska-residential-attic-foam-complete.jpg", "spray-foam", "Completed residential attic foam insulation Alaska"),
    ("IMG_5772.HEIC", "anchorage-bonus-room-spray-foam-insulation.jpg", "spray-foam", "Bonus room spray foam insulation Anchorage"),
    ("IMG_5773.HEIC", "alaska-dormer-spray-foam-application.jpg", "spray-foam", "Dormer spray foam insulation application Alaska"),
    ("IMG_5775.HEIC", "anchorage-knee-wall-spray-foam-insulation.jpg", "spray-foam", "Knee wall spray foam insulation Anchorage"),
    ("IMG_5776.HEIC", "alaska-sloped-ceiling-foam-insulation.jpg", "spray-foam", "Sloped ceiling foam insulation Alaska"),
    ("IMG_5777.HEIC", "anchorage-roof-insulation-spray-foam.jpg", "spray-foam", "Roof insulation with spray foam Anchorage"),
    ("IMG_5796.HEIC", "alaska-addition-spray-foam-insulation.jpg", "spray-foam", "Home addition spray foam insulation Alaska"),
    ("IMG_5798.HEIC", "anchorage-garage-ceiling-spray-foam.jpg", "spray-foam", "Garage ceiling spray foam insulation Anchorage"),
    ("IMG_5800.HEIC", "alaska-shop-building-foam-insulation.jpg", "commercial", "Shop building foam insulation Alaska"),
    ("IMG_5802.HEIC", "anchorage-outbuilding-spray-foam.jpg", "commercial", "Outbuilding spray foam insulation Anchorage"),
    ("IMG_5824.HEIC", "alaska-pole-barn-spray-foam-insulation.jpg", "commercial", "Pole barn spray foam insulation Alaska"),
    ("IMG_5920.HEIC", "anchorage-energy-efficient-home-insulation.jpg", "spray-foam", "Energy efficient home insulation Anchorage Alaska"),
]

def process_images():
    """Process and rename gallery images"""

    print("=" * 80)
    print("GALLERY IMAGE PROCESSING")
    print("=" * 80)
    print(f"\nProcessing images in: {GALLERY_DIR}\n")

    # Create manifest file
    manifest = []
    processed = 0
    skipped = 0

    for original, new_name, category, alt_text in IMAGE_MAPPINGS:
        # Find the original file (with or without extension)
        original_path = None
        for ext in ['', '.HEIC', '.heic', '.JPG', '.jpg', '.jpeg', '.JPEG', '.png', '.PNG']:
            test_path = GALLERY_DIR / f"{original}{ext}"
            if test_path.exists():
                original_path = test_path
                break

        if not original_path:
            print(f"⚠️  SKIP: '{original}' not found")
            skipped += 1
            continue

        new_path = GALLERY_DIR / new_name

        # Rename/copy the file
        try:
            if original_path != new_path:
                shutil.copy2(original_path, new_path)
                print(f"✓ RENAMED: '{original_path.name}' -> '{new_name}'")
                processed += 1
            else:
                print(f"✓ KEPT: '{new_name}' (already named correctly)")
                processed += 1

            # Add to manifest
            manifest.append({
                'src': f'/gallery/{new_name}',
                'alt': alt_text,
                'category': category,
                'original': original_path.name
            })

        except Exception as e:
            print(f"✗ ERROR processing '{original}': {e}")
            skipped += 1

    print(f"\n{'='*80}")
    print(f"SUMMARY:")
    print(f"  Processed: {processed}")
    print(f"  Skipped: {skipped}")
    print(f"  Total in manifest: {len(manifest)}")
    print(f"{'='*80}\n")

    # Write manifest
    manifest_path = GALLERY_DIR.parent / "gallery-manifest.json"
    import json
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)

    print(f"✓ Manifest written to: {manifest_path}")

    # Write TypeScript version for Astro
    ts_content = "// Auto-generated gallery images\nexport const galleryImages = " + json.dumps(manifest, indent=2) + ";\n"
    ts_path = Path("/mnt/HC_Volume_103321268/isolated-projects/foamologyinsulation-web/src/data/gallery-images.ts")
    ts_path.parent.mkdir(exist_ok=True)
    with open(ts_path, 'w') as f:
        f.write(ts_content)

    print(f"✓ TypeScript file written to: {ts_path}")

    return manifest

if __name__ == "__main__":
    manifest = process_images()

    print("\n" + "="*80)
    print("NEXT STEPS:")
    print("="*80)
    print("1. Convert HEIC files to JPG format (requires heif-convert or similar tool)")
    print("2. Optimize images to reduce file size")
    print("3. Update gallery.astro to use the new manifest")
    print("="*80)
