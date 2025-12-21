# Spray Foam Estimation Calculator - Tool Concept

**Source:** Owner ChatGPT conversation (December 2025)
**Status:** Tool Development Needed
**Priority:** HIGH - Immediate business value
**Created:** 2025-12-20

---

## Business Need

Magnus uses ChatGPT to calculate surface areas for spray foam quotes. This is a repetitive task that could be automated with a calculator on the website. Benefits:

1. **For Magnus:** Quick job estimates without manual calculations
2. **For Customers:** Interactive tool that increases engagement
3. **For SEO:** Valuable tool that attracts organic traffic ("spray foam calculator")
4. **For Leads:** Capture email in exchange for detailed estimate

---

## Example Calculations Requested

### Example 1: Metal Building (40x60, 17ft peak, 14ft walls)

**Given:**
- Building dimensions: 40ft x 60ft
- Peak height: 17ft
- Wall height: 14ft
- Spray foam thickness: 3" walls, 5" ceiling

**Wall Calculations:**

| Component | Formula | Result |
|-----------|---------|--------|
| Long walls (2) | 2 x (60 x 14) | 1,680 sq ft |
| Short walls below gable (2) | 2 x (40 x 14) | 1,120 sq ft |
| Gable ends (triangles) | 2 x (1/2 x 40 x 3) | 120 sq ft |
| **TOTAL WALLS** | | **2,920 sq ft** |

*Gable calculation: Peak is 17ft, wall is 14ft, so rise = 3ft. Base = 40ft.*

**Ceiling/Roof Calculations:**

| Option | Formula | Result |
|--------|---------|--------|
| Flat ceiling | 40 x 60 | 2,400 sq ft |
| Sloped roof deck* | 2 x 60 x sqrt(3^2 + 20^2) | 2,427 sq ft |

*Roof slope: Rise = 3ft (17-14), Run = 20ft (half of 40). Slope length = sqrt(409) = 20.22ft*

**Board Feet (for pricing):**

| Component | Sq Ft | Thickness | Board Feet |
|-----------|-------|-----------|------------|
| Walls | 2,920 | 3" | 8,760 BF |
| Ceiling (flat) | 2,400 | 5" | 12,000 BF |
| Ceiling (sloped) | 2,427 | 5" | 12,135 BF |
| **TOTAL (flat ceiling)** | | | **20,760 BF** |
| **TOTAL (sloped)** | | | **20,895 BF** |

---

### Example 2: Shed (10x12 with gable ends)

**Given:**
- Building dimensions: 10ft x 12ft
- Gable ends (need height to calculate)

**Assumptions for standard shed:**
- Wall height: 8ft (typical)
- Peak height: 10ft (2ft rise = 4:12 pitch)

**Wall Calculations:**

| Component | Formula | Result |
|-----------|---------|--------|
| Long walls (2) | 2 x (12 x 8) | 192 sq ft |
| Short walls below gable (2) | 2 x (10 x 8) | 160 sq ft |
| Gable ends (triangles) | 2 x (1/2 x 10 x 2) | 20 sq ft |
| **TOTAL WALLS** | | **372 sq ft** |

**Ceiling Calculations:**

| Option | Formula | Result |
|--------|---------|--------|
| Flat ceiling | 10 x 12 | 120 sq ft |
| Sloped roof deck | 2 x 12 x sqrt(2^2 + 5^2) | 129 sq ft |

---

## Calculator Tool Requirements

### Input Fields

**Building Type Selection:**
- [ ] Metal Building/Shop
- [ ] Residential Home (attic)
- [ ] Shed/Outbuilding
- [ ] Crawl Space
- [ ] Pole Barn
- [ ] Garage
- [ ] Commercial Space

**Dimensions:**
- Length (ft)
- Width (ft)
- Wall height (ft)
- Peak height (ft) - if applicable
- Roof type: Flat / Gable / Hip / Shed

**Spray Foam Options:**
- Foam type: Open Cell / Closed Cell
- Wall thickness: 2" / 3" / 4" (sliders)
- Ceiling thickness: 3" / 4" / 5" / 6" (sliders)

### Output Display

**Square Footage Summary:**
- Wall area (with breakdown)
- Ceiling area (flat or sloped option)
- Total spray area
- Gable end area (if applicable)

**Board Feet Calculation:**
- Wall board feet
- Ceiling board feet
- Total board feet

**Estimated Price Range:**
- Based on $/board foot for open vs closed cell
- Show range (low to high)
- Disclaimer: "Final price determined after inspection"

### Lead Capture

**Before showing detailed estimate:**
- Email (required)
- Phone (optional)
- Zip code (required - for service area check)
- "Get Your Estimate" button

**After submission:**
- Show full detailed breakdown
- Offer to schedule thermal imaging inspection
- Add to CRM/email list

---

## Technical Implementation Notes

### React Component Location
`src/components/tools/SprayFoamCalculator.tsx`

### Key Features
1. Real-time calculation updates as user types
2. Glass morphism styling to match site
3. Mobile-responsive (many contractors on phones)
4. Print-friendly results page
5. Email results option

### SEO Value
- Target keywords: "spray foam insulation calculator", "insulation cost calculator alaska"
- Schema markup for calculator tool
- Will drive organic traffic and leads

### Database/Analytics
- Log all calculations for market intelligence
- Track common building sizes
- Analyze price sensitivity (which foam types selected)

---

## Formulas Reference

### Rectangle Surface Area
```
Area = Length x Height
```

### Gable Triangle Area
```
Area = 0.5 x Base x Height
Rise = Peak Height - Wall Height
```

### Sloped Roof Area
```
Slope Length = sqrt(Rise^2 + Run^2)
Run = Building Width / 2
Roof Area = 2 x Length x Slope Length
```

### Board Feet
```
Board Feet = Square Feet x Thickness (inches)
```

### Perimeter (for crawl spaces)
```
Perimeter = 2 x (Length + Width)
Wall Area = Perimeter x Wall Height
```

---

## Priority Actions

1. **Phase 1:** Create basic calculator with building types
2. **Phase 2:** Add lead capture integration
3. **Phase 3:** Add price estimation (needs Magnus input on $/BF)
4. **Phase 4:** Analytics and CRM integration

---

## Verified Test Results (December 20, 2025)

All calculation logic has been tested and verified:

| Test Case | Building Type | Dimensions | Expected | Actual | Status |
|-----------|---------------|------------|----------|--------|--------|
| 1 | Metal Building | 40x60, 14ft walls, 17ft peak | 5,347 sqft, 20,895 BF | 5,347 sqft, 20,894 BF | PASS |
| 2 | Shed | 10x12, 8ft walls, 10ft peak | 501 sqft | 501 sqft | PASS |
| 3 | Crawl Space | 30x40, 3ft walls | 1,620 sqft, 7,260 BF | 1,620 sqft, 7,260 BF | PASS |
| 4 | Flat Roof | 24x30, 10ft walls (no peak) | 1,800 sqft | 1,800 sqft | PASS |
| 5 | Garage | 20x20, 4" walls, 6" ceiling | 3,360 + 2,448 BF | 3,360 + 2,448 BF | PASS |
| 6 | Decimal Input | 12.5x15.5, 8.5ft walls | ~476 sqft walls | 476 sqft | PASS |
| 7 | Large Pole Barn | 60x100, 16ft walls, 22ft peak | ~47,030 BF | 47,034 BF | PASS |

Note: 1 BF difference in Test 1 is rounding artifact (0.005% variance) - acceptable.

---

## Implementation Status

**COMPLETED: December 20, 2025**

Files created:
- `src/components/tools/SprayFoamCalculator.tsx` - React calculator component
- `src/pages/tools/index.astro` - Tools landing page
- `src/pages/tools/spray-foam-calculator.astro` - Calculator page

Navigation: Added to About dropdown menu ("Tools & Calculators")

---

*Document created from owner ChatGPT conversation - December 2025*
*Calculator BUILT and VERIFIED - Ready for production*
