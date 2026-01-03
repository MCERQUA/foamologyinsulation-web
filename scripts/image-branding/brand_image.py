#!/usr/bin/env python3
"""
Foamology Image Branding Tool
Composites customer photos with branded frames, logos, and text overlays.
"""

import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

# Paths
SCRIPT_DIR = Path(__file__).parent
TEMPLATES_DIR = SCRIPT_DIR / "templates"
OUTPUT_DIR = SCRIPT_DIR / "output"
PROJECT_ROOT = SCRIPT_DIR.parent.parent
LOGO_PATH = PROJECT_ROOT / "public/images/logos/foamology-logo.png"
LOGO_WH_PATH = PROJECT_ROOT / "public/images/logos/foamology-logo-WH-BK.png"

# Chromakey color (bright green)
CHROMA_KEY = (0, 255, 0)
CHROMA_TOLERANCE = 50  # How much variance from pure green to accept


def find_chromakey_bounds(frame_img):
    """Find the bounding box of the chromakey (green) area."""
    img_array = np.array(frame_img)

    # Find pixels that are close to chromakey green
    r, g, b = img_array[:,:,0], img_array[:,:,1], img_array[:,:,2]

    # Green pixels: high G, low R, low B
    green_mask = (
        (g > 200) &
        (r < 100) &
        (b < 100)
    )

    # Find bounding box of green area
    rows = np.any(green_mask, axis=1)
    cols = np.any(green_mask, axis=0)

    if not rows.any() or not cols.any():
        print("Warning: No chromakey area found!")
        return None

    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]

    return (cmin, rmin, cmax + 1, rmax + 1)  # left, top, right, bottom


def replace_chromakey(frame_img, customer_img, bounds):
    """Replace the chromakey area with the customer image."""
    left, top, right, bottom = bounds
    width = right - left
    height = bottom - top

    # Resize customer image to fit the chromakey area
    customer_resized = customer_img.copy()
    customer_resized.thumbnail((width, height), Image.Resampling.LANCZOS)

    # Center the customer image in the chromakey area
    paste_x = left + (width - customer_resized.width) // 2
    paste_y = top + (height - customer_resized.height) // 2

    # Create output image
    result = frame_img.copy()

    # First, fill chromakey area with black (or customer image background)
    draw = ImageDraw.Draw(result)
    draw.rectangle(bounds, fill=(20, 20, 30))

    # Paste customer image
    result.paste(customer_resized, (paste_x, paste_y))

    return result


def replace_chromakey_with_mask(frame_img, customer_img):
    """Replace chromakey using pixel-level masking for better edges."""
    frame_array = np.array(frame_img)

    # Create mask for non-green pixels (the frame)
    r, g, b = frame_array[:,:,0], frame_array[:,:,1], frame_array[:,:,2]
    frame_mask = ~((g > 180) & (r < 120) & (b < 120))

    # Find chromakey bounds
    bounds = find_chromakey_bounds(frame_img)
    if bounds is None:
        return frame_img

    left, top, right, bottom = bounds
    width = right - left
    height = bottom - top

    # Resize customer image to fill the chromakey area
    # Use cover mode - fill the area completely
    customer_aspect = customer_img.width / customer_img.height
    target_aspect = width / height

    if customer_aspect > target_aspect:
        # Customer image is wider - fit by height
        new_height = height
        new_width = int(height * customer_aspect)
    else:
        # Customer image is taller - fit by width
        new_width = width
        new_height = int(width / customer_aspect)

    customer_resized = customer_img.resize((new_width, new_height), Image.Resampling.LANCZOS)

    # Center crop to exact size
    crop_left = (new_width - width) // 2
    crop_top = (new_height - height) // 2
    customer_cropped = customer_resized.crop((crop_left, crop_top, crop_left + width, crop_top + height))

    # Create result image starting with customer image as base
    result = Image.new('RGB', frame_img.size, (20, 20, 30))
    result.paste(customer_cropped, (left, top))

    # Overlay the frame (non-green parts)
    result_array = np.array(result)
    result_array[frame_mask] = frame_array[frame_mask]

    return Image.fromarray(result_array)


def add_logo(img, logo_path, position='bottom-right', size_percent=15, margin=20):
    """Add logo to image."""
    if not logo_path.exists():
        print(f"Warning: Logo not found at {logo_path}")
        return img

    logo = Image.open(logo_path).convert('RGBA')

    # Calculate logo size
    max_size = int(min(img.width, img.height) * size_percent / 100)
    logo.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)

    # Calculate position
    if position == 'bottom-right':
        x = img.width - logo.width - margin
        y = img.height - logo.height - margin
    elif position == 'bottom-left':
        x = margin
        y = img.height - logo.height - margin
    elif position == 'top-right':
        x = img.width - logo.width - margin
        y = margin
    elif position == 'top-left':
        x = margin
        y = margin
    elif position == 'bottom-center':
        x = (img.width - logo.width) // 2
        y = img.height - logo.height - margin
    else:
        x, y = margin, margin

    # Composite logo
    result = img.copy().convert('RGBA')
    result.paste(logo, (x, y), logo)

    return result.convert('RGB')


def add_text_banner(img, text, position='bottom',
                    font_size=36, font_color=(255, 255, 255),
                    bg_color=(26, 54, 93, 230), padding=15):
    """Add text with semi-transparent background banner."""
    result = img.copy().convert('RGBA')

    # Try to load a nice font, fall back to default
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()

    draw = ImageDraw.Draw(result)

    # Get text bounding box
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Calculate banner position
    banner_height = text_height + padding * 2
    if position == 'bottom':
        banner_top = img.height - banner_height
    else:
        banner_top = 0

    # Draw semi-transparent banner
    overlay = Image.new('RGBA', result.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rectangle(
        [(0, banner_top), (img.width, banner_top + banner_height)],
        fill=bg_color
    )
    result = Image.alpha_composite(result, overlay)

    # Draw text centered in banner
    draw = ImageDraw.Draw(result)
    text_x = (img.width - text_width) // 2
    text_y = banner_top + padding

    # Add subtle shadow
    draw.text((text_x + 2, text_y + 2), text, font=font, fill=(0, 0, 0, 128))
    draw.text((text_x, text_y), text, font=font, fill=font_color)

    return result.convert('RGB')


def add_service_badge(img, service_type, position='top-left', margin=20):
    """Add a service type badge/tag."""
    result = img.copy().convert('RGBA')

    # Badge colors by service type
    badge_colors = {
        'spray-foam': (26, 54, 93),      # Navy blue
        'thermal': (220, 38, 38),         # Red
        'removal': (234, 88, 12),         # Orange
        'crawlspace': (22, 163, 74),      # Green
        'blow-in': (59, 130, 246),        # Blue
        'inspection': (147, 51, 234),     # Purple
    }

    color = badge_colors.get(service_type.lower(), (26, 54, 93))

    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
    except:
        font = ImageFont.load_default()

    draw = ImageDraw.Draw(result)

    # Format service type text
    text = service_type.upper().replace('-', ' ')
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    padding = 12
    badge_width = text_width + padding * 2
    badge_height = text_height + padding * 2

    # Position
    if 'right' in position:
        x = img.width - badge_width - margin
    else:
        x = margin
    if 'bottom' in position:
        y = img.height - badge_height - margin
    else:
        y = margin

    # Draw badge with rounded corners effect
    overlay = Image.new('RGBA', result.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rounded_rectangle(
        [(x, y), (x + badge_width, y + badge_height)],
        radius=8,
        fill=(*color, 230)
    )
    result = Image.alpha_composite(result, overlay)

    # Draw text
    draw = ImageDraw.Draw(result)
    draw.text((x + padding, y + padding), text, font=font, fill=(255, 255, 255))

    return result.convert('RGB')


def brand_image(customer_image_path,
                frame_template='frame-social-square-v1.png',
                output_name=None,
                headline=None,
                service_type=None,
                add_company_logo=True):
    """
    Main function to create a branded image from customer photo.

    Args:
        customer_image_path: Path to customer's original image
        frame_template: Name of frame template file in templates/
        output_name: Output filename (auto-generated if None)
        headline: Optional headline text for bottom banner
        service_type: Optional service badge (spray-foam, thermal, etc.)
        add_company_logo: Whether to add the Foamology logo

    Returns:
        Path to the created branded image
    """
    # Load images
    customer_path = Path(customer_image_path)
    if not customer_path.exists():
        raise FileNotFoundError(f"Customer image not found: {customer_path}")

    frame_path = TEMPLATES_DIR / frame_template
    if not frame_path.exists():
        raise FileNotFoundError(f"Frame template not found: {frame_path}")

    print(f"Loading customer image: {customer_path.name}")
    customer_img = Image.open(customer_path).convert('RGB')

    print(f"Loading frame template: {frame_template}")
    frame_img = Image.open(frame_path).convert('RGB')

    # Replace chromakey with customer image
    print("Compositing images...")
    result = replace_chromakey_with_mask(frame_img, customer_img)

    # Add service badge if specified
    if service_type:
        print(f"Adding service badge: {service_type}")
        result = add_service_badge(result, service_type, position='top-left')

    # Add headline banner if specified
    if headline:
        print(f"Adding headline: {headline}")
        result = add_text_banner(result, headline)

    # Add logo
    if add_company_logo:
        print("Adding company logo...")
        logo_to_use = LOGO_WH_PATH if LOGO_WH_PATH.exists() else LOGO_PATH
        result = add_logo(result, logo_to_use, position='bottom-right', size_percent=18)

    # Save output
    if output_name is None:
        output_name = f"branded_{customer_path.stem}.jpg"

    output_path = OUTPUT_DIR / output_name
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Save as JPEG with good quality
    result.save(output_path, 'JPEG', quality=90, optimize=True)
    print(f"Saved branded image: {output_path}")

    return output_path


def batch_brand_images(image_folder, service_type=None, headline_template=None):
    """Process multiple images from a folder."""
    folder = Path(image_folder)
    if not folder.exists():
        print(f"Folder not found: {folder}")
        return

    images = list(folder.glob('*.jpg')) + list(folder.glob('*.jpeg')) + list(folder.glob('*.png'))
    print(f"Found {len(images)} images to process")

    for img_path in images:
        try:
            headline = None
            if headline_template:
                # Could customize headline per image based on filename
                headline = headline_template

            brand_image(
                img_path,
                headline=headline,
                service_type=service_type
            )
        except Exception as e:
            print(f"Error processing {img_path.name}: {e}")


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Brand customer images with Foamology overlays')
    parser.add_argument('image', help='Path to customer image')
    parser.add_argument('--frame', default='frame-social-square-v1.png', help='Frame template name')
    parser.add_argument('--headline', help='Headline text for bottom banner')
    parser.add_argument('--service', help='Service type badge (spray-foam, thermal, removal, crawlspace, blow-in, inspection)')
    parser.add_argument('--output', help='Output filename')
    parser.add_argument('--no-logo', action='store_true', help='Skip adding company logo')

    args = parser.parse_args()

    brand_image(
        args.image,
        frame_template=args.frame,
        output_name=args.output,
        headline=args.headline,
        service_type=args.service,
        add_company_logo=not args.no_logo
    )
