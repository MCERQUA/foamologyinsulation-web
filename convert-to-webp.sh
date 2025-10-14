#!/bin/bash
################################################################################
# WebP Conversion Script for Gallery Images
# Converts all JPG images to WebP format for better web performance
################################################################################

GALLERY_DIR="/mnt/HC_Volume_103321268/isolated-projects/foamologyinsulation-web/public/gallery"

echo "=============================================================================="
echo "WebP CONVERSION SCRIPT"
echo "=============================================================================="
echo ""
echo "Converting images in: $GALLERY_DIR"
echo ""

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "❌ ERROR: cwebp is not installed!"
    echo ""
    echo "Install with:"
    echo "  Ubuntu/Debian: sudo apt-get install webp"
    echo "  Mac:           brew install webp"
    echo "  Fedora:        sudo dnf install libwebp-tools"
    echo ""
    exit 1
fi

echo "✓ cwebp found"
echo ""

# Counter variables
converted=0
skipped=0
failed=0

# Convert all JPG/JPEG files to WebP
cd "$GALLERY_DIR" || exit 1

for file in *.jpg *.jpeg *.JPG *.JPEG 2>/dev/null; do
    # Skip if no files match
    [ -e "$file" ] || continue

    # Get filename without extension
    filename="${file%.*}"
    webp_file="${filename}.webp"

    # Skip if WebP already exists and is newer
    if [ -f "$webp_file" ] && [ "$webp_file" -nt "$file" ]; then
        echo "⏭  SKIP: $webp_file (already exists and is up-to-date)"
        ((skipped++))
        continue
    fi

    # Convert to WebP with quality 85
    echo "🔄 Converting: $file -> $webp_file"

    if cwebp -q 85 -m 6 "$file" -o "$webp_file" > /dev/null 2>&1; then
        # Get file sizes
        original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        webp_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file" 2>/dev/null)

        # Calculate savings
        if [ -n "$original_size" ] && [ -n "$webp_size" ]; then
            savings=$((100 - (webp_size * 100 / original_size)))
            original_kb=$((original_size / 1024))
            webp_kb=$((webp_size / 1024))
            echo "   ✓ SUCCESS: ${original_kb}KB -> ${webp_kb}KB (${savings}% smaller)"
        else
            echo "   ✓ SUCCESS"
        fi
        ((converted++))
    else
        echo "   ✗ FAILED to convert $file"
        ((failed++))
    fi
    echo ""
done

echo "=============================================================================="
echo "CONVERSION SUMMARY"
echo "=============================================================================="
echo "  Converted: $converted"
echo "  Skipped:   $skipped"
echo "  Failed:    $failed"
echo "=============================================================================="
echo ""

if [ $converted -gt 0 ]; then
    echo "✓ WebP conversion complete!"
    echo ""
    echo "NEXT STEPS:"
    echo "1. Test images load correctly at /gallery"
    echo "2. Verify WebP files are being served to modern browsers"
    echo "3. Monitor file sizes and quality"
    echo ""
    echo "BENEFIT: WebP typically reduces file size by 25-35% vs JPG"
    echo "         with same visual quality!"
    echo ""
fi

exit 0
