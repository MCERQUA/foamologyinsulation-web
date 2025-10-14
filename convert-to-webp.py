#!/usr/bin/env python3
"""
Convert all gallery JPG images to WebP format
"""
import os
import subprocess
from pathlib import Path

GALLERY_DIR = Path("/mnt/HC_Volume_103321268/isolated-projects/foamologyinsulation-web/public/gallery")
JPG_DIR = GALLERY_DIR / "jpg"
WEBP_DIR = GALLERY_DIR / "webp"

print("=" * 80)
print("WebP CONVERSION")
print("=" * 80)
print(f"\nConverting images from: {JPG_DIR}")
print(f"Output directory: {WEBP_DIR}\n")

# Check if cwebp is installed
try:
    subprocess.run(['cwebp', '-version'], capture_output=True, check=True)
    print("✓ cwebp found\n")
except (subprocess.CalledProcessError, FileNotFoundError):
    print("❌ ERROR: cwebp is not installed!")
    print("\nInstall with:")
    print("  Ubuntu/Debian: sudo apt-get install webp")
    print("  Mac:           brew install webp")
    exit(1)

# Ensure webp directory exists
WEBP_DIR.mkdir(exist_ok=True)

converted = 0
skipped = 0
failed = 0

# Find all JPG files in the jpg/ subdirectory
jpg_files = list(JPG_DIR.glob("*.jpg")) + list(JPG_DIR.glob("*.JPG")) + \
            list(JPG_DIR.glob("*.jpeg")) + list(JPG_DIR.glob("*.JPEG"))

print(f"Found {len(jpg_files)} JPG images to process\n")

for jpg_file in sorted(jpg_files):
    webp_file = WEBP_DIR / jpg_file.with_suffix('.webp').name

    # Skip if WebP exists and is newer
    if webp_file.exists() and webp_file.stat().st_mtime > jpg_file.stat().st_mtime:
        print(f"⏭  SKIP: {webp_file.name} (already up-to-date)")
        skipped += 1
        continue

    print(f"🔄 Converting: {jpg_file.name} -> {webp_file.name}")

    # Convert to WebP
    try:
        result = subprocess.run(
            ['cwebp', '-q', '85', '-m', '6', str(jpg_file), '-o', str(webp_file)],
            capture_output=True,
            text=True,
            check=True
        )

        # Calculate savings
        original_size = jpg_file.stat().st_size
        webp_size = webp_file.stat().st_size
        savings = 100 - (webp_size * 100 // original_size)
        original_kb = original_size // 1024
        webp_kb = webp_size // 1024

        print(f"   ✓ SUCCESS: {original_kb}KB -> {webp_kb}KB ({savings}% smaller)\n")
        converted += 1

    except subprocess.CalledProcessError as e:
        print(f"   ✗ FAILED: {e}\n")
        failed += 1

print("=" * 80)
print("CONVERSION SUMMARY")
print("=" * 80)
print(f"  Converted: {converted}")
print(f"  Skipped:   {skipped}")
print(f"  Failed:    {failed}")
print("=" * 80)

if converted > 0:
    print("\n✓ WebP conversion complete!")
    print("\nBENEFITS:")
    print("  - 25-35% smaller file sizes")
    print("  - Faster page loads")
    print("  - Better SEO rankings")
    print("  - Automatic browser support with JPG fallback")
