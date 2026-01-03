# Phase 8: Schema Markup - R-Value Guide for Alaska

## Required Schema Types

1. Article Schema (primary)
2. FAQPage Schema
3. BreadcrumbList Schema
4. HowTo Schema (optional - for "how to choose" section)

---

## 1. Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "R-Value Guide for Alaska: Complete Energy Savings Breakdown",
  "description": "Learn Alaska's R-value requirements for maximum energy savings. Discover how proper insulation in Zone 7-8 climates can reduce heating costs by 30-50%.",
  "image": {
    "@type": "ImageObject",
    "url": "https://foamologyinsulation.com/images/blog/alaska-r-value-guide-hero-foamology-insulation-20251220.jpg",
    "width": 1200,
    "height": 675
  },
  "author": {
    "@type": "Organization",
    "name": "Foamology Insulation",
    "url": "https://foamologyinsulation.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://foamologyinsulation.com/images/logos/foamology-logo.png"
    }
  },
  "publisher": {
    "@type": "Organization",
    "name": "Foamology Insulation",
    "url": "https://foamologyinsulation.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://foamologyinsulation.com/images/logos/foamology-logo.png"
    }
  },
  "datePublished": "2025-12-20",
  "dateModified": "2025-12-20",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://foamologyinsulation.com/blog/r-value-guide-for-alaska"
  },
  "keywords": "energy savings insulation, Alaska R-value requirements, spray foam insulation Alaska, Zone 7 insulation, Zone 8 insulation, Alaska building code insulation",
  "articleSection": "Home Insulation Guides",
  "wordCount": 3000,
  "inLanguage": "en-US"
}
```

---

## 2. FAQPage Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What R-value do I need for my home in Alaska?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Alaska recommends R-49 to R-60 for attics, R-21 to R-30 for walls, and R-25 to R-30 for floors. Most of Alaska is in Climate Zone 7, with some areas in Zone 8, which have the highest insulation requirements in the United States. The minimum building code requires R-49 for ceilings, R-20+5 for walls, and R-38 for floors."
      }
    },
    {
      "@type": "Question",
      "name": "What is Alaska's building code for insulation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Alaska follows the Building Energy Efficiency Standard (BEES) based on the IECC. Minimum requirements include R-49 for ceilings, R-20+5 or R-13+10 for above-grade walls, R-15 for below-grade walls, R-38 for floors, and windows with U-0.27 maximum. These are the most stringent requirements in the United States due to Alaska's extreme climate."
      }
    },
    {
      "@type": "Question",
      "name": "How much can I save on heating bills with better insulation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Alaska homeowners can reduce heating costs by 30-50% with proper insulation. AHFC reports their weatherization programs have saved over 50,000 households an average of 30% annually on energy bills. For a typical Alaska home spending $4,000-5,000 per year on heating, this means potential savings of $1,200-2,500 annually."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best insulation for Alaska homes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Closed-cell spray foam insulation is considered optimal for Alaska due to its high R-value (R-6 to R-7 per inch), moisture resistance, and superior air sealing properties. It requires less thickness to achieve R-49 (about 7-8 inches vs 14-16 inches for fiberglass) and lasts 80-100 years. Open-cell spray foam is a cost-effective alternative for interior applications."
      }
    },
    {
      "@type": "Question",
      "name": "Is spray foam worth the extra cost in Alaska?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, spray foam is typically worth the higher upfront cost in Alaska. The 30-50% energy savings combined with Alaska's high heating costs means spray foam typically pays for itself in 3-5 years—faster than in warmer climates. Additionally, spray foam's air sealing properties are especially valuable in Alaska's extreme cold where air leakage can account for 40% of energy loss."
      }
    },
    {
      "@type": "Question",
      "name": "Which climate zone is Alaska in?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most of Alaska is in IECC Climate Zone 7. The following boroughs are in Zone 8 (subarctic): Bethel, Northwest Arctic, Dillingham, Southeast Fairbanks, Fairbanks North Star, Wade Hampton, Nome, Yukon-Koyukuk, and North Slope. Both Zone 7 and Zone 8 have the highest insulation requirements in the United States building code."
      }
    },
    {
      "@type": "Question",
      "name": "How do I prevent ice dams with proper insulation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ice dams form when heat escapes through the roof, melting snow that refreezes at the eaves. Prevent ice dams by ensuring R-49 or higher attic insulation combined with comprehensive air sealing. Spray foam applied to the roof deck is particularly effective as it creates both insulation and an air barrier. Proper attic ventilation also helps maintain cold roof temperatures."
      }
    },
    {
      "@type": "Question",
      "name": "Are there rebates for insulation in Alaska?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, several programs offer rebates and assistance. AHFC's Home Energy Rebate Program provides up to $10,000 for energy efficiency improvements. Federal tax credits under the Inflation Reduction Act offer 30% of project costs (maximum $1,200/year for insulation). Income-qualified homeowners may qualify for free improvements through the Weatherization Assistance Program."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need different insulation in permafrost areas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, permafrost areas require special engineering considerations. Standard ground-contact insulation practices don't apply because heat from the building can melt permafrost, causing structural damage. Buildings in permafrost areas should be constructed on open, ventilated crawl spaces to minimize heat transfer to the ground and prevent uneven settling."
      }
    },
    {
      "@type": "Question",
      "name": "What's the difference between open-cell and closed-cell spray foam?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Open-cell spray foam has R-3.5-3.7 per inch, is less expensive ($1-3/sq ft), and is best for interior walls and soundproofing. Closed-cell spray foam has R-6-7 per inch, costs more ($1.50-4.50/sq ft), but provides moisture resistance, acts as a vapor barrier, and adds structural strength. For Alaska's extreme conditions, closed-cell is recommended for attics, crawl spaces, and exterior applications."
      }
    }
  ]
}
```

---

## 3. BreadcrumbList Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://foamologyinsulation.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://foamologyinsulation.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "R-Value Guide for Alaska",
      "item": "https://foamologyinsulation.com/blog/r-value-guide-for-alaska"
    }
  ]
}
```

---

## 4. HowTo Schema (For "How to Choose" Section)

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Choose the Right Insulation R-Value for Your Alaska Home",
  "description": "Step-by-step guide to determining the proper insulation R-values for different areas of your Alaska home based on climate zone and building codes.",
  "totalTime": "PT30M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "tool": [
    {
      "@type": "HowToTool",
      "name": "Tape measure"
    },
    {
      "@type": "HowToTool",
      "name": "Flashlight"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Determine Your Climate Zone",
      "text": "Identify whether your Alaska location is in IECC Zone 7 (most of Alaska) or Zone 8 (Bethel, Fairbanks North Star, Nome, North Slope and other northern boroughs)."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Check Current Attic Insulation",
      "text": "Measure the depth of existing attic insulation. If less than 15-16 inches of fiberglass (R-49), you likely need an upgrade. Check for gaps, settling, or damage."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Assess Wall Insulation",
      "text": "Determine if walls have insulation by removing an outlet cover on an exterior wall and looking inside the cavity. Older homes may have little or no wall insulation."
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Evaluate Crawl Space or Basement",
      "text": "Check floor insulation from below. Look for insulation batts, foam board, or signs of moisture damage. Uninsulated floors lose significant heat in Alaska."
    },
    {
      "@type": "HowToStep",
      "position": 5,
      "name": "Get Professional Energy Assessment",
      "text": "Schedule a professional thermal inspection or energy audit. Experts use infrared cameras to identify heat loss areas and calculate the most cost-effective upgrades for your specific home."
    }
  ]
}
```

---

## Implementation Notes

### For Astro/MDX Blog Post

The schemas should be added to the page's `<head>` section. The existing blog layout likely has a slot for schema data. Options:

1. **Inline in frontmatter**: Add as JSON in a custom frontmatter field
2. **Separate component**: Create `<ArticleSchema>` component
3. **Script tag in MDX**: Add `<script type="application/ld+json">` in post

### Schema Validation

Test all schemas at:
- https://validator.schema.org/
- https://search.google.com/test/rich-results

### Existing Components Check

The site has these schema components in `src/components/seo/`:
- FAQSchema.astro
- ServiceSchema.astro
- BreadcrumbSchema.astro
- HowToSchema.astro

Likely can leverage these existing components for the blog post.
