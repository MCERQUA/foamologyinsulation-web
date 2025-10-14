#!/usr/bin/env python3
"""
Find duplicate images by comparing visual content using perceptual hashing
"""

from pathlib import Path
from PIL import Image
import imagehash
from collections import defaultdict

GALLERY_DIR = Path("public/gallery/webp")

def find_duplicate_images():
    """Find duplicate images by computing perceptual hashes"""

    print("Scanning images in", GALLERY_DIR)
    print("=" * 70)

    # Dictionary to store hash -> list of files
    hash_dict = defaultdict(list)

    # Get all WebP files
    webp_files = sorted(GALLERY_DIR.glob("*.webp"))

    print(f"Found {len(webp_files)} images to analyze...")
    print()

    # Compute hash for each image
    for img_path in webp_files:
        try:
            with Image.open(img_path) as img:
                # Use average hash for fast comparison
                img_hash = imagehash.average_hash(img, hash_size=16)
                hash_dict[str(img_hash)].append(img_path.name)
        except Exception as e:
            print(f"Error processing {img_path.name}: {e}")

    # Find duplicates (hashes with multiple files)
    duplicates = {h: files for h, files in hash_dict.items() if len(files) > 1}

    if duplicates:
        print(f"Found {len(duplicates)} groups of duplicate images:")
        print("=" * 70)
        print()

        for i, (hash_val, files) in enumerate(duplicates.items(), 1):
            print(f"Duplicate Group #{i}:")
            print(f"  Hash: {hash_val}")
            print(f"  Files ({len(files)}):")
            for file in sorted(files):
                print(f"    - {file}")
            print()

        # Summary
        total_duplicates = sum(len(files) - 1 for files in duplicates.values())
        print("=" * 70)
        print(f"Total: {len(duplicates)} groups, {total_duplicates} duplicate files that could be removed")
        print()

        # Suggest which ones to keep
        print("Recommendation:")
        print("Keep the files with better SEO names (descriptive, Alaska/Anchorage keywords)")
        print("Remove generic names like 'IMG_XXXX.webp', 'Crawlspace Insulation.webp', etc.")

    else:
        print("No duplicate images found!")
        print("All images are unique.")

    print()
    print("=" * 70)

if __name__ == "__main__":
    find_duplicate_images()
