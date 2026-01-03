#!/usr/bin/env python3
"""
Apply Optimized Images - Foamology Insulation Website
Replaces original images with optimized versions.
Keeps backups of all originals (NEVER DELETES).
"""

import os
import shutil
from pathlib import Path
from datetime import datetime
from PIL import Image

def get_file_size_mb(path):
    """Get file size in MB"""
    if not os.path.exists(path):
        return 0
    return os.path.getsize(path) / (1024 * 1024)

def apply_optimized_images():
    """Apply optimized images from subdirectories"""

    # Create backup directory with timestamp
    backup_dir = Path("public/images-backup-" + datetime.now().strftime("%Y%m%d-%H%M%S"))
    backup_dir.mkdir(exist_ok=True)

    print("="*60)
    print("APPLYING OPTIMIZED IMAGES")
    print("="*60)
    print(f"\nBackup directory: {backup_dir}")

    # Directories with optimized subdirectories
    dirs_to_process = [
        "public/gallery/webp",
        "public/images/blog",
    ]

    total_saved = 0
    files_updated = 0

    for dir_path in dirs_to_process:
        optimized_dir = Path(dir_path) / "optimized"

        if not optimized_dir.exists():
            print(f"\nNo optimized directory found: {optimized_dir}")
            continue

        print(f"\n{'='*60}")
        print(f"Processing: {dir_path}")
        print(f"{'='*60}")

        # Find all optimized files
        for opt_file in optimized_dir.rglob("*"):
            if not opt_file.is_file():
                continue

            # Calculate relative path
            rel_path = opt_file.relative_to(optimized_dir)

            # Original file path (try same extension first, then original)
            original_path = Path(dir_path) / rel_path

            # If optimized is JPG but original was PNG, find the PNG
            if not original_path.exists():
                if opt_file.suffix.lower() == '.jpg':
                    png_original = original_path.with_suffix('.png')
                    if png_original.exists():
                        original_path = png_original

            if not original_path.exists():
                print(f"  SKIP (original not found): {rel_path}")
                continue

            # Calculate sizes
            original_size = get_file_size_mb(original_path)
            optimized_size = get_file_size_mb(opt_file)

            if optimized_size >= original_size:
                print(f"  SKIP (no improvement): {rel_path.name}")
                continue

            # Create backup subdirectory structure
            backup_subdir = backup_dir / dir_path / rel_path.parent
            backup_subdir.mkdir(parents=True, exist_ok=True)

            # Move original to backup
            backup_path = backup_subdir / original_path.name
            shutil.copy2(original_path, backup_path)

            # Replace with optimized (rename if extension changed)
            if original_path.suffix.lower() != opt_file.suffix.lower():
                # Extension changed (e.g., PNG -> JPG)
                new_path = original_path.with_suffix(opt_file.suffix.lower())
                shutil.copy2(opt_file, new_path)
                # Keep the old file for now (in case references exist)
                # But also mark it for potential cleanup
                print(f"  ✓ {original_path.name} -> {new_path.name} ({original_size:.2f}MB -> {optimized_size:.2f}MB)")
            else:
                shutil.copy2(opt_file, original_path)
                print(f"  ✓ {rel_path.name} ({original_size:.2f}MB -> {optimized_size:.2f}MB)")

            saved = original_size - optimized_size
            total_saved += saved
            files_updated += 1

    print(f"\n{'='*60}")
    print(f"COMPLETE!")
    print(f"{'='*60}")
    print(f"Files updated: {files_updated}")
    print(f"Total space saved: {total_saved:.2f} MB")
    print(f"Originals backed up to: {backup_dir}")

    return backup_dir

def optimize_main_images():
    """Optimize the main images that didn't compress well as PNG"""

    print(f"\n{'='*60}")
    print("OPTIMIZING MAIN IMAGES (PNG -> JPG)")
    print(f"{'='*60}")

    # Large PNG files that need JPG conversion
    png_files = [
        "public/images/alaska-anchorage-ice-damming-solutions.png",
        "public/images/spray-foam-insulation-blog.png",
    ]

    for png_path in png_files:
        png_file = Path(png_path)

        if not png_file.exists():
            print(f"  SKIP (not found): {png_path}")
            continue

        jpg_path = png_file.with_suffix('.jpg')
        original_size = get_file_size_mb(png_file)

        try:
            with Image.open(png_file) as img:
                # Convert to RGB (JPG doesn't support transparency)
                if img.mode in ('RGBA', 'P', 'LA'):
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    background.paste(img, mask=img.split()[-1] if 'A' in img.mode else None)
                    img = background
                elif img.mode != 'RGB':
                    img = img.convert('RGB')

                # Resize if very large
                if img.width > 1920:
                    ratio = 1920 / img.width
                    new_width = 1920
                    new_height = int(img.height * ratio)
                    img = img.resize((new_width, new_height), Image.LANCZOS)

                # Save as optimized JPG
                img.save(jpg_path, 'JPEG', quality=85, optimize=True)

            optimized_size = get_file_size_mb(jpg_path)
            reduction = ((original_size - optimized_size) / original_size) * 100

            print(f"  ✓ {png_file.name} -> {jpg_path.name}")
            print(f"    {original_size:.2f}MB -> {optimized_size:.2f}MB ({reduction:.1f}% reduction)")

        except Exception as e:
            print(f"  ERROR: {png_file.name}: {e}")

def main():
    """Main entry point"""

    # Change to project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    os.chdir(project_root)

    # Apply optimized images
    backup_dir = apply_optimized_images()

    # Optimize main PNG images
    optimize_main_images()

    print(f"\n{'='*60}")
    print("NEXT STEPS:")
    print(f"{'='*60}")
    print("1. Test the website: npm run dev")
    print("2. Check gallery and blog images load correctly")
    print("3. Update any code references from .png to .jpg for main images")
    print("4. If issues, restore from backup:", backup_dir)

if __name__ == "__main__":
    main()
