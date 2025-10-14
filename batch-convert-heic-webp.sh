#!/bin/bash
# Batch convert HEIC to WebP - optimized for speed
# Uses Python/pillow-heif for HEIC decode and cwebp for WebP encode

GALLERY_DIR="public/gallery"
TEMP_DIR="$GALLERY_DIR/temp_conversion"
QUALITY=85

# Create temp directory
mkdir -p "$TEMP_DIR"

echo "=================================="
echo "HEIC to WebP Batch Conversion"
echo "=================================="
echo ""

# Count HEIC files
heic_count=$(ls "$GALLERY_DIR"/*.HEIC 2>/dev/null | wc -l)

if [ "$heic_count" -eq 0 ]; then
    echo "No HEIC files found in $GALLERY_DIR"
    exit 0
fi

echo "Found $heic_count HEIC files to convert"
echo ""

# Create a simple Python helper for HEIC to temp JPG
python3 <<'PYTHON_SCRIPT'
import sys
from pathlib import Path
from PIL import Image
import pillow_heif

pillow_heif.register_heif_opener()

gallery_dir = Path("public/gallery")
temp_dir = gallery_dir / "temp_conversion"

for heic_file in sorted(gallery_dir.glob("*.HEIC")):
    try:
        img = Image.open(heic_file)
        if img.mode in ('RGBA', 'LA', 'P'):
            img = img.convert('RGB')

        # Save as temp JPG (fast)
        temp_jpg = temp_dir / f"{heic_file.stem}.jpg"
        img.save(temp_jpg, 'JPEG', quality=95)
        print(f"✓ {heic_file.name}")
    except Exception as e:
        print(f"✗ {heic_file.name}: {e}", file=sys.stderr)
PYTHON_SCRIPT

echo ""
echo "Stage 2: Converting JPG to WebP..."
echo ""

# Convert all temp JPGs to WebP
converted=0
for jpg_file in "$TEMP_DIR"/*.jpg; do
    [ -e "$jpg_file" ] || continue

    basename=$(basename "$jpg_file" .jpg)
    webp_file="$GALLERY_DIR/${basename}.webp"

    if cwebp -q $QUALITY "$jpg_file" -o "$webp_file" > /dev/null 2>&1; then
        echo "✓ ${basename}.webp"
        ((converted++))
    else
        echo "✗ Failed: ${basename}.webp"
    fi
done

# Clean up temp directory
rm -rf "$TEMP_DIR"

echo ""
echo "=================================="
echo "Conversion Complete: $converted files"
echo "=================================="
