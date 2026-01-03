# Phase 7: Article Design - R-Value Guide for Alaska

## Visual Hierarchy

### Above the Fold
1. **H1 Title**: R-Value Guide for Alaska: Complete Energy Savings Breakdown
2. **Quick Answer InfoBox**: Immediate value for searchers
3. **StatsCard**: 4 key metrics at a glance
4. **Featured Image**: Professional insulation work in Alaska

### Content Structure Pattern

Each major section follows this pattern:
1. H2 heading with keyword integration
2. Brief intro paragraph (2-3 sentences)
3. H3 subheadings for detailed points
4. Visual element (table, InfoBox, or image)
5. Internal/external links where natural

## Component Specifications

### InfoBox Variants Used

**1. Quick Answer (info variant)**
```tsx
<InfoBox variant="info" title="Quick Answer">
Alaska requires R-49 for attics, R-20+ for walls. Zone 7-8
designation means highest U.S. insulation standards. Proper
insulation can reduce heating costs by 30-50%.
</InfoBox>
```

**2. Pro Tips (tip variant)**
```tsx
<InfoBox variant="tip" title="Pro Tip: Maximum Energy Savings">
Combine R-49 attic insulation with comprehensive air sealing
for maximum energy savings. Air leakage accounts for up to
40% of energy loss in Alaska homes.
</InfoBox>
```

**3. Warnings (warning variant)**
```tsx
<InfoBox variant="warning" title="Permafrost Considerations">
In permafrost areas, standard insulation practices don't apply.
Engineering analysis is required for any ground-contact insulation
to prevent structural damage from thawing permafrost.
</InfoBox>
```

**4. Success Stories (success variant)**
```tsx
<InfoBox variant="success" title="Alaska Energy Savings Example">
A 2,000 sq ft Anchorage home upgraded from R-30 to R-49 attic
insulation saw heating bills drop from $4,200 to $2,520 annually—
a 40% reduction that paid back the investment in under 4 years.
</InfoBox>
```

### StatsCard Configuration

```tsx
<StatsCard
  client:load
  title="Alaska Insulation Quick Facts"
  stats={[
    { value: "R-49", label: "Attic Minimum", description: "Required ceiling R-value" },
    { value: "30-50%", label: "Energy Savings", description: "Heating cost reduction" },
    { value: "Zone 7-8", label: "Climate Zone", description: "Highest U.S. requirements" },
    { value: "3-5 yrs", label: "Payback", description: "Investment recovery time" }
  ]}
/>
```

### CTABlock Configuration

```tsx
<CTABlock
  client:load
  title="Get Your Free Alaska Home Insulation Assessment"
  description="Discover your home's R-value needs and potential energy savings. Our experts provide comprehensive evaluations for Alaska homeowners."
  buttonText="Schedule Free Assessment"
  buttonLink="/contact"
  variant="primary"
/>
```

## Table Designs

### R-Value Requirements Table (Primary)

```html
| Component | Zone 7 | Zone 8 | Notes |
|-----------|--------|--------|-------|
| **Ceiling/Attic** | R-49 | R-49+ | Higher recommended |
| **Walls (Above Grade)** | R-20+5 or R-13+10 | R-21+10 | Continuous insulation |
| **Walls (Below Grade)** | R-15 | R-15+ | Basement walls |
| **Floors** | R-38 | R-38+ | Crawl spaces |
| **Slab Edge** | R-10 | R-10+ | Perimeter minimum |
| **Windows** | U-0.27 | U-0.27 | Maximum U-factor |
```

### Insulation Comparison Table

```html
| Insulation Type | R-Value/Inch | Lifespan | Air Sealing | Cost/Sq Ft |
|-----------------|--------------|----------|-------------|------------|
| **Closed-Cell Spray Foam** | R-6 to R-7 | 80-100 years | Excellent | $1.50-$4.50 |
| **Open-Cell Spray Foam** | R-3.5-3.7 | 80-100 years | Good | $1.00-$3.00 |
| **Fiberglass Batts** | R-2.2-3.8 | 15-20 years | Poor | $0.10-$0.50 |
| **Blown Cellulose** | R-3.2-3.8 | 20-30 years | Partial | $0.50-$1.50 |
| **Rigid Foam Board** | R-4-6.5 | 50+ years | Partial | $0.50-$2.00 |
```

## Image Specifications

### Required Images (6 total)

1. **Hero Image**
   - Content: Professional installing spray foam in Alaska home
   - Alt: "Professional spray foam insulation installation in Anchorage Alaska attic achieving R-49 value"
   - Size: 1200x675 (16:9)
   - Loading: eager

2. **Climate Zone Map**
   - Content: Alaska map showing Zone 7 and Zone 8 regions
   - Alt: "Alaska IECC climate zone map showing Zone 7 and Zone 8 regions for insulation requirements"
   - Size: 800x600
   - Loading: lazy

3. **R-Value Comparison Infographic**
   - Content: Visual comparison of insulation types
   - Alt: "R-value comparison chart showing spray foam, fiberglass, and cellulose insulation performance in Alaska conditions"
   - Size: 1000x750
   - Loading: lazy

4. **Energy Savings Chart**
   - Content: Before/after heating cost comparison
   - Alt: "Alaska home energy savings chart showing 40% reduction in heating costs after proper insulation upgrade"
   - Size: 800x500
   - Loading: lazy

5. **Ice Dam Prevention Diagram**
   - Content: Cross-section showing proper vs improper attic insulation
   - Alt: "Ice dam prevention diagram showing how R-49 attic insulation prevents heat loss and ice formation on Alaska roofs"
   - Size: 900x600
   - Loading: lazy

6. **Thermal Imaging**
   - Content: Before/after thermal image of insulated home
   - Alt: "Thermal imaging comparison showing heat loss before and after spray foam insulation in Alaska home"
   - Size: 800x400
   - Loading: lazy

### Image Naming Convention
`{topic}-{description}-foamology-insulation-{date}.jpg`
Example: `alaska-r-value-requirements-map-foamology-insulation-20251220.jpg`

## Typography & Styling

### Heading Hierarchy
- **H1**: One per page, includes primary keyword
- **H2**: Major sections (5-7 total)
- **H3**: Subsections within H2s (2-4 per H2)
- **H4**: Rarely used, only for deep nesting

### Text Formatting
- **Bold**: Key terms, statistics, important points
- *Italic*: Emphasis, definitions, citations
- Links: Underlined with color (automatic)
- Lists: Bulleted for features, numbered for steps

### Spacing Guidelines
- Between H2 sections: Large gap (my-12)
- Between H3 sections: Medium gap (my-8)
- Between paragraphs: Standard (automatic)
- Around tables/images: my-8 with figcaption

## Mobile Responsiveness

### Table Handling
- Tables scroll horizontally on mobile
- Consider card-based alternative for key comparisons
- Minimum touch target 44px for links

### Image Sizing
- Max-width: 100%
- Aspect ratio preserved
- Lazy loading for below-fold images

### Component Stacking
- StatsCard: 2x2 grid on tablet, 1 column on mobile
- InfoBox: Full width on all devices
- CTABlock: Stack button below text on mobile

## Reading Experience

### Estimated Metrics
- Word count: 2,800-3,200 words
- Read time: 12-15 minutes
- Flesch-Kincaid: 8th-10th grade level
- Sentences per paragraph: 2-4

### Scanability Features
- Clear H2/H3 structure
- Bold key takeaways
- InfoBox for critical info
- Tables for comparisons
- Bullet lists for features

## Accessibility

- Alt text on all images
- Table headers marked correctly
- Sufficient color contrast
- Link text is descriptive
- Heading hierarchy is logical
