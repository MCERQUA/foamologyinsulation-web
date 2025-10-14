#!/usr/bin/env python3
"""Quick HEIC to WebP conversion - optimized for batch processing"""
import sys
from pathlib import Path
from PIL import Image
import pillow_heif
import subprocess

pillow_heif.register_heif_opener()

GALLERY_DIR = Path("public/gallery")
TEMP_DIR = GALLERY_DIR / "temp_jpg"
WEBP_QUALITY = 85

# Create temp directory
TEMP_DIR.mkdir(exist_ok=True)

print("=" * 70)
print("HEIC to WebP Conversion")
print("=" * 70)

# Get HEIC files
heic_files = sorted(GALLERY_DIR.glob("*.HEIC"))
print(f"\nFound {len(heic_files)} HEIC files\n")

# Stage 1: HEIC to temp JPG (Python - fast)
print("Stage 1: Converting HEIC to temporary JPG...\n")
temp_jpgs = []

for i, heic_file in enumerate(heic_files, 1):
    try:
        img = Image.open(heic_file)
        if img.mode in ('RGBA', 'LA', 'P'):
            img = img.convert('RGB')

        temp_jpg = TEMP_DIR / f"{heic_file.stem}.jpg"
        img.save(temp_jpg, 'JPEG', quality=95)
        temp_jpgs.append(temp_jpg)

        if i % 10 == 0:
            print(f"Progress: {i}/{len(heic_files)}")
    except Exception as e:
        print(f"✗ Failed {heic_file.name}: {e}")

print(f"\nStage 1 complete: {len(temp_jpgs)} files\n")

# Stage 2: JPG to WebP (cwebp - fastest)
print("Stage 2: Converting to WebP...\n")
converted = 0

for i, jpg_file in enumerate(temp_jpgs, 1):
    webp_file = GALLERY_DIR / f"{jpg_file.stem}.webp"
    try:
        result = subprocess.run(
            ['cwebp', '-q', str(WEBP_QUALITY), str(jpg_file), '-o', str(webp_file)],
            capture_output=True,
            timeout=30
        )
        if result.returncode == 0:
            converted += 1
            if i % 10 == 0:
                print(f"Progress: {i}/{len(temp_jpgs)}")
    except Exception as e:
        print(f"✗ Failed {jpg_file.stem}: {e}")

# Cleanup
import shutil
shutil.rmtree(TEMP_DIR)

print(f"\n{'=' * 70}")
print(f"Complete: {converted} WebP files created")
print(f"{'=' * 70}")
