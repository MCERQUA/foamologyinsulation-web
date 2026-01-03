# Visual Plan: Thermal Imaging for Ice Dams

## Image Strategy Overview

This article requires 6-8 images combining:
- **Real gallery photos** (for authenticity) - thermal imaging, ice dam damage, spray foam installation
- **AI-generated infographics** (for explanation) - diagrams, charts, process flows

## Image Requirements

### Image 1: Hero/Featured Image
**Type:** Real gallery photo OR abstract concept
**File:** Use existing gallery: `alaska-ice-dam-roof-damage-repair-needed.webp` or `alaska-missing-vapor-barrier-heat-loss-thermal.webp`
**Alt Text:** "Thermal imaging showing heat loss patterns on Michigan roof causing ice dam formation"
**Placement:** Top of article, hero section
**Size:** Full width, 16:9 aspect ratio

### Image 2: Ice Dam Formation Diagram
**Type:** AI-generated infographic
**Prompt:** "Clean educational infographic diagram showing ice dam formation on a house roof cross-section. Show: 1) Heat rising from house into attic, 2) Warm roof deck melting snow, 3) Water flowing to cold eaves, 4) Ice dam forming at roof edge, 5) Water backing up under shingles. Use blue for cold areas, orange/red for warm areas. White background, clean lines, labeled arrows. Professional building science illustration style. No people."
**Alt Text:** "Diagram showing how ice dams form when heat escapes from attic melts roof snow that refreezes at cold eaves"
**Placement:** Section 2 - What Are Ice Dams
**Size:** 1:1 aspect ratio, max 800px wide

### Image 3: Thermal Imaging Example
**Type:** Real gallery photo
**File:** Use existing gallery: `alaska-thermal-camera-energy-audit.jpg` or `alaska-missing-vapor-barrier-heat-loss-thermal.webp`
**Alt Text:** "Professional thermal imaging camera detecting heat loss and insulation problems in attic"
**Placement:** Section 4 - How Thermal Imaging Detects
**Size:** 4:3 aspect ratio

### Image 4: Heat Loss Locations Infographic
**Type:** AI-generated infographic
**Prompt:** "Clean educational infographic showing common attic heat loss locations in a house cross-section. Highlight with red/orange indicators: 1) Recessed can lights, 2) Plumbing stacks, 3) Electrical penetrations, 4) Attic access hatch, 5) Top plates, 6) HVAC ducts, 7) Bathroom exhaust fans. Blue background house silhouette with white labels. Professional building science diagram. No people."
**Alt Text:** "Infographic showing 7 common locations where heat escapes into attic including recessed lights, plumbing stacks, and electrical penetrations"
**Placement:** Section 5 - Common Heat Loss Problems
**Size:** 16:9 aspect ratio

### Image 5: Spray Foam Application Diagram
**Type:** AI-generated infographic (OR real gallery photo)
**Option A - Gallery Photo:** `alaska-roof-deck-spray-foam-insulation-1.webp` or `alaska-closed-cell-spray-foam-installation.webp`
**Option B - Infographic Prompt:** "Clean educational diagram showing spray foam insulation applied to roof deck underside in unvented attic. Cross-section view showing: rafters, spray foam layer, roof deck, shingles. Label R-value zones. Blue cool tones for exterior, warm tones for interior. Professional building science illustration. No people."
**Alt Text:** "Cross-section showing closed-cell spray foam applied to roof deck underside creating air seal and thermal barrier"
**Placement:** Section 6 - Spray Foam Solution
**Size:** 16:9 aspect ratio

### Image 6: Cost Comparison Chart
**Type:** AI-generated infographic
**Prompt:** "Clean professional bar chart infographic comparing ice dam costs. Three categories: 1) Prevention (one-time) $3,000-$12,000 in green, 2) Annual Removal $650-$2,400 in orange, 3) Damage Repair $900-$6,200 per incident in red. Show 5-year and 10-year cumulative cost comparison. Dark background with white text and colorful bars. Modern data visualization style. No photos, no people."
**Alt Text:** "Cost comparison chart showing ice dam prevention vs annual removal costs over 10 years"
**Placement:** Section 6 - ROI subsection
**Size:** 16:9 aspect ratio

### Image 7: 5-Step Process Infographic
**Type:** AI-generated infographic
**Prompt:** "Clean horizontal process flow infographic showing 5 steps of ice dam prevention. Steps: 1) Thermal Imaging Inspection (camera icon), 2) Assessment Report (document icon), 3) Air Sealing (foam gun icon), 4) Insulation Installation (insulation roll icon), 5) Verification Scan (checkmark icon). Connected by arrows. Blue and green color scheme on white background. Professional minimal design. No people, no photos."
**Alt Text:** "5-step ice dam prevention process: thermal imaging, assessment, air sealing, insulation, verification"
**Placement:** Section 7 - Professional Process
**Size:** 16:9 aspect ratio

### Image 8: Temperature Threshold Chart
**Type:** AI-generated infographic
**Prompt:** "Simple educational infographic showing ice dam formation temperature thresholds. Thermometer graphic showing: Attic >30°F (danger zone in orange), Outdoor <22°F (in blue), Roof surface differential causing ice dam. Clean minimal design with temperature scale. White background, professional style. No people."
**Alt Text:** "Temperature chart showing ice dams form when attic exceeds 30°F and outdoor temperature is below 22°F"
**Placement:** FAQ section - temperature question
**Size:** 1:1 aspect ratio, smaller size

---

## Gallery Photos to Use (Already Exist)

From `/public/gallery/webp/`:

1. **alaska-ice-dam-roof-damage-repair-needed.webp** - Ice dam damage (hero option)
2. **alaska-missing-vapor-barrier-heat-loss-thermal.webp** - Thermal image showing heat loss
3. **alaska-thermal-camera-energy-audit.jpg** - Thermal camera in use
4. **alaska-closed-cell-spray-foam-installation.webp** - Spray foam being applied
5. **alaska-roof-deck-spray-foam-insulation-1.webp** - Roof deck application
6. **alaska-roof-deck-spray-foam-insulation-2.webp** - Roof deck alternate view
7. **alaska-attic-floor-air-barrier-ice-dam-prevention.webp** - Attic air sealing
8. **alaska-rim-joist-spray-foam-air-sealing-1.webp** - Air sealing example

---

## Images to Generate (5 Infographics)

1. **02-ice-dam-formation-diagram.png** - How ice dams form
2. **04-heat-loss-locations.png** - Common attic heat loss points
3. **05-spray-foam-diagram.png** - Spray foam application (optional if using gallery)
4. **06-cost-comparison-chart.png** - Prevention vs removal costs
5. **07-process-steps.png** - 5-step process flow
6. **08-temperature-threshold.png** - Temperature conditions chart

---

## Image Specifications

- **Resolution:** 1K (1024px) for all AI-generated images
- **Format:** PNG for infographics, WEBP for photos
- **Aspect Ratios:**
  - Hero: 16:9
  - Diagrams: 16:9 or 1:1
  - Charts: 16:9
  - Process: 16:9
- **File Size Target:** Under 300KB after optimization
- **Style:** Clean, professional, modern, educational
- **Colors:** Blue/green for cool, orange/red for warm, white backgrounds

---

## Image Generation Commands

Use `mcp__gemini__generate_images` with:
- model: "gemini-2.5-flash-image"
- aspectRatio: as specified per image
- numImages: 1
- outputDir: Article images directory

---

*Visual Plan Created: 2025-12-20*
*Ready for image generation*
