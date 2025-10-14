#!/usr/bin/env python3
"""
Convert HEIC files (with .jpg extension) to actual JPG format
Requires: pillow-heif
Install: python3 -m venv venv && source venv/bin/activate && pip install pillow pillow-heif
"""
import os
import sys
from pathlib import Path

print("=" * 80)
print("HEIC TO JPG CONVERSION")
print("=" * 80)
print()

# Check if pillow-heif is installed
try:
    from pillow_heif import register_heif_opener
    from PIL import Image
    register_heif_opener()
    print("✓ Required libraries found\n")
except ImportError:
    print("❌ ERROR: Required libraries not installed!\n")
    print("Install with:")
    print("  python3 -m venv venv")
    print("  source venv/bin/activate")
    print("  pip install pillow pillow-heif")
    print()
    print("Then run this script again:")
    print("  python3 convert-heic-to-jpg.py")
    sys.exit(1)

GALLERY_DIR = Path("/mnt/HC_Volume_103321268/isolated-projects/foamologyinsulation-web/public/gallery")

print(f"Converting images in: {GALLERY_DIR}\n")

if not GALLERY_DIR.exists():
    print(f"❌ ERROR: Gallery directory not found: {GALLERY_DIR}")
    sys.exit(1)

converted = 0
skipped = 0
failed = 0

# Get all .jpg files
jpg_files = list(GALLERY_DIR.glob("*.jpg")) + list(GALLERY_DIR.glob("*.JPG"))
print(f"Found {len(jpg_files)} files to check\n")

# Process each file
for jpg_file in sorted(jpg_files):
    try:
        # Try to open the image
        img = Image.open(jpg_file)

        # Check if it's actually HEIC format
        if img.format == "HEIF":
            print(f"🔄 Converting: {jpg_file.name}")

            # Get original size
            original_size = jpg_file.stat().st_size
            original_kb = original_size // 1024

            # Convert to RGB if needed (HEIF can be RGBA)
            if img.mode in ("RGBA", "LA", "P"):
                img = img.convert("RGB")

            # Save as actual JPG to temporary file
            temp_file = jpg_file.with_suffix(".tmp.jpg")
            img.save(temp_file, "JPEG", quality=90, optimize=True)

            # Get new size
            new_size = temp_file.stat().st_size
            new_kb = new_size // 1024

            # Calculate difference
            if new_size < original_size:
                savings = 100 - (new_size * 100 // original_size)
                print(f"   ✓ SUCCESS: {original_kb}KB → {new_kb}KB ({savings}% smaller)")
            elif new_size > original_size:
                increase = (new_size * 100 // original_size) - 100
                print(f"   ✓ SUCCESS: {original_kb}KB → {new_kb}KB ({increase}% larger)")
            else:
                print(f"   ✓ SUCCESS: {original_kb}KB (same size)")

            # Replace original with converted version
            temp_file.replace(jpg_file)
            converted += 1

        else:
            print(f"⏭  SKIP: {jpg_file.name} (already JPG format)")
            skipped += 1

    except Exception as e:
        print(f"   ✗ FAILED: {jpg_file.name}")
        print(f"      Error: {e}")
        failed += 1

    print()

print("=" * 80)
print("CONVERSION SUMMARY")
print("=" * 80)
print(f"  Converted: {converted}")
print(f"  Skipped:   {skipped}")
print(f"  Failed:    {failed}")
print("=" * 80)

if converted > 0:
    print("\n✓ HEIC to JPG conversion complete!")
    print("\nNEXT STEP: Run WebP conversion")
    print("  python3 convert-to-webp.py")
    print("\nThis will create WebP versions (25-35% smaller) for modern browsers")
    print("while keeping JPG files as fallback for older browsers.")
elif skipped > 0 and failed == 0:
    print("\n✓ All files are already in JPG format!")
    print("\nYou can proceed with WebP conversion:")
    print("  python3 convert-to-webp.py")
else:
    print("\n⚠️  Some conversions failed. Please check the errors above.")
