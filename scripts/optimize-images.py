#!/usr/bin/env python3
"""
Image Optimization Script for Foamology Insulation Website
Compresses and optimizes all images for web performance.

NEVER DELETES - Creates optimized versions alongside originals.
"""

import os
import sys
from pathlib import Path
from PIL import Image
import shutil

# Configuration
MAX_WIDTH_HERO = 1920  # Hero/banner images
MAX_WIDTH_GALLERY = 1200  # Gallery images
MAX_WIDTH_BLOG = 1200  # Blog images
MAX_WIDTH_LOGO = 400  # Logo images
JPG_QUALITY = 82  # Balance of quality and size
WEBP_QUALITY = 80  # WebP can be slightly lower due to better compression

# Directories to process
DIRS_TO_PROCESS = [
    ("public/gallery/webp", MAX_WIDTH_GALLERY, "gallery"),
    ("public/images/blog", MAX_WIDTH_BLOG, "blog"),
    ("public/images", MAX_WIDTH_HERO, "main"),
]

def get_file_size_mb(path):
    """Get file size in MB"""
    return os.path.getsize(path) / (1024 * 1024)

def optimize_image(input_path, output_path, max_width, quality):
    """Optimize a single image"""
    try:
        with Image.open(input_path) as img:
            # Convert to RGB if necessary (for PNG with transparency, we'll handle separately)
            original_mode = img.mode

            # Get original dimensions
            orig_width, orig_height = img.size

            # Calculate new dimensions maintaining aspect ratio
            if orig_width > max_width:
                ratio = max_width / orig_width
                new_width = max_width
                new_height = int(orig_height * ratio)
            else:
                new_width, new_height = orig_width, orig_height

            # Resize if needed
            if new_width != orig_width:
                img = img.resize((new_width, new_height), Image.LANCZOS)

            # Determine output format
            output_ext = Path(output_path).suffix.lower()

            if output_ext in ['.jpg', '.jpeg']:
                # Convert to RGB for JPG
                if img.mode in ('RGBA', 'P', 'LA'):
                    # Create white background for transparent images
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    background.paste(img, mask=img.split()[-1] if 'A' in img.mode else None)
                    img = background
                elif img.mode != 'RGB':
                    img = img.convert('RGB')

                img.save(output_path, 'JPEG', quality=quality, optimize=True)

            elif output_ext == '.webp':
                # WebP supports transparency
                if img.mode == 'P':
                    img = img.convert('RGBA')
                img.save(output_path, 'WEBP', quality=quality, optimize=True)

            elif output_ext == '.png':
                # Keep PNG but optimize
                img.save(output_path, 'PNG', optimize=True)

            return True

    except Exception as e:
        print(f"  ERROR: {e}")
        return False

def process_directory(dir_path, max_width, category):
    """Process all images in a directory"""
    path = Path(dir_path)
    if not path.exists():
        print(f"Directory not found: {dir_path}")
        return

    # Create optimized subdirectory
    optimized_dir = path / "optimized"
    optimized_dir.mkdir(exist_ok=True)

    # Find all images
    extensions = ['*.jpg', '*.jpeg', '*.png', '*.webp', '*.JPG', '*.JPEG', '*.PNG', '*.WEBP']
    images = []
    for ext in extensions:
        images.extend(path.glob(ext))

    # Also check subdirectories for blog images
    if category == "blog":
        for ext in extensions:
            images.extend(path.rglob(ext))

    if not images:
        print(f"No images found in {dir_path}")
        return

    print(f"\n{'='*60}")
    print(f"Processing {category.upper()} images in: {dir_path}")
    print(f"Found {len(images)} images")
    print(f"{'='*60}")

    total_original = 0
    total_optimized = 0
    processed = 0
    skipped = 0

    for img_path in sorted(images):
        # Skip files in optimized directory
        if 'optimized' in str(img_path):
            continue

        # Get relative path for subdirectories
        relative = img_path.relative_to(path)

        # Create output path
        if len(relative.parts) > 1:
            # Has subdirectory
            subdir = optimized_dir / relative.parent
            subdir.mkdir(parents=True, exist_ok=True)
            output_path = subdir / relative.name
        else:
            output_path = optimized_dir / relative.name

        # Convert PNG photos to JPG for better compression
        output_ext = img_path.suffix.lower()
        if output_ext == '.png' and category in ['blog', 'gallery']:
            # Check if it's a photo (not a diagram/logo)
            output_path = output_path.with_suffix('.jpg')

        original_size = get_file_size_mb(img_path)
        total_original += original_size

        # Skip if already small enough
        if original_size < 0.15:  # Less than 150KB
            skipped += 1
            total_optimized += original_size
            continue

        print(f"\n{img_path.name}")
        print(f"  Original: {original_size:.2f} MB")

        # Determine quality based on size
        quality = JPG_QUALITY if output_path.suffix.lower() != '.webp' else WEBP_QUALITY

        if optimize_image(str(img_path), str(output_path), max_width, quality):
            optimized_size = get_file_size_mb(output_path)
            total_optimized += optimized_size
            reduction = ((original_size - optimized_size) / original_size) * 100
            print(f"  Optimized: {optimized_size:.2f} MB ({reduction:.1f}% reduction)")
            processed += 1
        else:
            total_optimized += original_size

    print(f"\n{'-'*60}")
    print(f"SUMMARY for {category}:")
    print(f"  Processed: {processed} images")
    print(f"  Skipped (already small): {skipped} images")
    print(f"  Original total: {total_original:.2f} MB")
    print(f"  Optimized total: {total_optimized:.2f} MB")
    if total_original > 0:
        print(f"  Total reduction: {((total_original - total_optimized) / total_original) * 100:.1f}%")
    print(f"  Optimized images saved to: {optimized_dir}")

def main():
    """Main entry point"""
    print("="*60)
    print("FOAMOLOGY INSULATION - IMAGE OPTIMIZATION")
    print("="*60)
    print("\nThis script will create optimized versions of all images.")
    print("Original files are NEVER deleted.")
    print("\nTarget sizes:")
    print(f"  - Hero images: max {MAX_WIDTH_HERO}px wide")
    print(f"  - Gallery images: max {MAX_WIDTH_GALLERY}px wide")
    print(f"  - Blog images: max {MAX_WIDTH_BLOG}px wide")
    print(f"  - JPG quality: {JPG_QUALITY}%")
    print(f"  - WebP quality: {WEBP_QUALITY}%")

    # Change to project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    os.chdir(project_root)

    for dir_path, max_width, category in DIRS_TO_PROCESS:
        process_directory(dir_path, max_width, category)

    print("\n" + "="*60)
    print("OPTIMIZATION COMPLETE")
    print("="*60)
    print("\nNext steps:")
    print("1. Review optimized images in 'optimized' subdirectories")
    print("2. If satisfied, run: python3 scripts/apply-optimized-images.py")
    print("3. This will replace originals with optimized versions")

if __name__ == "__main__":
    main()
