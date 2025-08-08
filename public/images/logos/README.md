# Logo Setup Instructions

## Current Status
Placeholder SVG logos have been created and are ready to use. The website will work immediately with these placeholders.

## Placeholder Logos Created:
- `spfa-logo.svg` - SPFA placeholder
- `contractors-choice-logo.svg` - Contractors Choice placeholder
- `huntsman-logo.svg` - Huntsman placeholder
- `energy-star-logo.svg` - Energy Star placeholder
- `better-buildings-logo.svg` - Better Buildings placeholder

## To Replace with Actual Logos:

Download the actual logos from these sources and save them in this directory:

1. **SPFA (Spray Polyurethane Foam Alliance)**
   - Source: https://www.rooferscoffeeshop.com/video/spray-polyurethane-foam-alliance-spfa-video-playlist
   - Save as: `spfa-logo.png` or `spfa-logo.svg`

2. **Contractors Choice Agency**
   - Source: https://res.cloudinary.com/zoominfo-com/image/upload/w_70,h_70,c_fit/contractorschoiceagency.com
   - Save as: `contractors-choice-logo.png` or `contractors-choice-logo.svg`

3. **Huntsman Building Solutions**
   - Source: https://huntsmanbuildingsolutions.com/en-US/
   - Save as: `huntsman-logo.png` or `huntsman-logo.svg`

4. **Energy Star**
   - Source: https://www.pikpng.com/transpng/iiiTiob/
   - Save as: `energy-star-logo.png` or `energy-star-logo.svg`

5. **Better Buildings Challenge**
   - Source: https://www.houstonisd.org/cms/lib2/TX01001591/Centricity/Domain/8301/BetterBuildingsChallenge.png
   - Save as: `better-buildings-logo.png` or `better-buildings-logo.svg`

## Image Requirements:

- Format: PNG with transparent background or SVG
- Recommended height: 100-150px (will be displayed at 48px height)
- The logos will automatically be converted to white with black shadow/glow effect via CSS filters

## CSS Filter Applied:

The following CSS filter is applied to make logos white with black glow:
```css
filter: brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 8px rgba(0, 0, 0, 0.3));
```

This converts any colored logo to white and adds a black shadow/glow effect for visibility.

## Updating the Component:

When you replace the placeholder logos with actual ones, update the file extensions in `src/components/ui/LogoScroller.tsx` if needed (from .svg to .png).
