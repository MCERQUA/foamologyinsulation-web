# Service Page Templates & Best Practices

## Overview

This document provides standardized templates, components, and best practices for creating consistent, high-converting service pages for Foamology Insulation.

---

## Standard Service Page Template

### Page Structure

```
1. Hero Section
   - H1 Headline
   - Subheadline (25-40 words)
   - Hero Image
   - Primary CTA Button
   - Secondary CTA (phone)
   - Trust Indicators (3)

2. Introduction (200-300 words)
   - Opening hook
   - Problem statement
   - Solution introduction
   - Why Foamology
   - Page preview

3. Service Explanation (300-400 words)
   - What the service involves
   - Technical details (accessible language)
   - Options/variations

4. Benefits Section (400-500 words)
   - 7-10 key benefits
   - Benefit icons/visual elements
   - Alaska-specific benefits highlighted

5. Process Section (300-400 words)
   - Step-by-step breakdown
   - Timeline expectations
   - What customers should expect

6. Cost & ROI Section (300-400 words)
   - Pricing ranges/guidance
   - Example ROI calculations
   - Available rebates/incentives

7. Alaska Climate Section (200-300 words)
   - Alaska-specific considerations
   - Extreme weather performance
   - Local relevance

8. FAQ Section (400-500 words)
   - 10-15 questions
   - Address common concerns
   - Technical questions
   - Process questions

9. Related Services (150-200 words)
   - 4-5 related services
   - Brief descriptions
   - Links

10. Final CTA Section
    - Strong closing headline
    - Contact form
    - Phone number
    - Address/map
```

---

## Component Templates

### Hero Section Template

```html
<section class="hero pt-24 pb-12">
  <div class="container">
    <div class="hero-content">
      <h1>[Service Name]: [Compelling Benefit Statement]</h1>
      <p class="subheadline">[25-40 word description addressing customer pain point and solution]</p>
      <div class="trust-indicators">
        <span>[Trust Point 1]</span>
        <span>[Trust Point 2]</span>
        <span>[Trust Point 3]</span>
      </div>
      <div class="cta-buttons">
        <a href="#contact" class="btn-primary">[Primary CTA Text]</a>
        <a href="tel:9073103000" class="btn-secondary">Call (907) 310-3000</a>
      </div>
    </div>
    <div class="hero-image">
      <img src="[image-path]" alt="[Descriptive alt text with location]">
    </div>
  </div>
</section>
```

### Benefits Section Template

```html
<section class="benefits">
  <div class="container">
    <h2>Benefits of [Service Name]</h2>
    <div class="benefits-grid">
      <div class="benefit-card">
        <div class="benefit-icon">[Icon]</div>
        <h3>[Benefit Title]</h3>
        <p>[50-75 word benefit description with specific data if applicable]</p>
      </div>
      <!-- Repeat for 7-10 benefits -->
    </div>
  </div>
</section>
```

### Process Section Template

```html
<section class="process">
  <div class="container">
    <h2>Our [Service Name] Process</h2>
    <div class="process-steps">
      <div class="step">
        <div class="step-number">1</div>
        <h3>[Step Title]</h3>
        <p>[75-100 word step description]</p>
      </div>
      <!-- Repeat for each step (typically 5-7 steps) -->
    </div>
    <div class="timeline">
      <h3>Timeline</h3>
      <p>[Timeline expectations]</p>
    </div>
  </div>
</section>
```

### FAQ Section Template

```html
<section class="faq">
  <div class="container">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-list">
      <details class="faq-item">
        <summary>Q: [Question text]?</summary>
        <div class="answer">
          <p>A: [50-100 word answer]</p>
        </div>
      </details>
      <!-- Repeat for 10-15 questions -->
    </div>
  </div>
</section>
```

### CTA Section Template

```html
<section class="final-cta">
  <div class="container">
    <h2>[Strong closing headline with action]</h2>
    <p>[Brief reinforcement of value proposition]</p>
    <div class="cta-content">
      <div class="contact-form">
        <!-- Form fields -->
      </div>
      <div class="contact-info">
        <p class="phone">Call: <a href="tel:9073103000">(907) 310-3000</a></p>
        <p class="email">Email: info@foamologyinsulation.com</p>
        <p class="address">901 E Klatt Road #6, Anchorage, AK 99515</p>
      </div>
    </div>
  </div>
</section>
```

---

## SEO Templates

### Title Tag Formula

```
[Primary Service] [Location] | [Unique Value] - Foamology
```

**Examples:**
- Spray Foam Insulation Anchorage AK | 50%+ Energy Savings - Foamology
- Attic Insulation Alaska | Ice Dam Prevention Expert - Foamology
- Crawl Space Encapsulation Anchorage | Stop Frozen Pipes - Foamology

**Character Limit:** 55-60 characters

### Meta Description Formula

```
[Service benefit statement]. [Unique value proposition]. [CTA]. Call (907) 310-3000.
```

**Examples:**
- Professional spray foam insulation in Anchorage, Alaska. Superior R-values, complete air sealing, 50%+ energy savings. Free estimates. Call (907) 310-3000.
- Stop ice dams at the source with professional attic insulation. Permanent solutions, not temporary fixes. Alaska specialists. Call (907) 310-3000.

**Character Limit:** 150-155 characters

### H1 Formula

```
[Service Name]: [Action/Benefit] for [Audience/Location]
```

**Examples:**
- Spray Foam Insulation: Professional Installation for Alaska Homes
- Ice Dam Prevention: Stop Ice Dams at Their Source
- Crawl Space Encapsulation: Complete Protection for Alaska Homes

---

## Schema Markup Templates

### Service Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "[Service Name]",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Foamology Insulation",
    "image": "https://foamologyinsulation.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "901 E Klatt Road #6",
      "addressLocality": "Anchorage",
      "addressRegion": "AK",
      "postalCode": "99515",
      "addressCountry": "US"
    },
    "telephone": "+1-907-310-3000",
    "email": "info@foamologyinsulation.com",
    "url": "https://foamologyinsulation.com",
    "priceRange": "$$",
    "areaServed": [
      {"@type": "City", "name": "Anchorage"},
      {"@type": "AdministrativeArea", "name": "Mat-Su Valley"},
      {"@type": "AdministrativeArea", "name": "Kenai Peninsula Borough"}
    ]
  },
  "description": "[150-200 word service description]",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock"
  }
}
```

### FAQPage Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question text]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer text]"
      }
    }
  ]
}
```

---

## Content Writing Guidelines

### Tone & Voice

**Professional but Approachable:**
- Expert knowledge without jargon
- Confident recommendations
- Honest about limitations
- Local and personal

**Active Voice:**
- "We install spray foam" not "Spray foam is installed"
- "You'll save money" not "Money will be saved"

**Customer-Focused:**
- Benefits before features
- "You" more than "we"
- Address pain points directly

### Formatting Standards

**Paragraphs:**
- 3-5 sentences maximum
- One main idea per paragraph
- Use white space generously

**Lists:**
- Use bullet points for benefits and features
- Use numbered lists for processes and steps
- Keep list items parallel in structure

**Headers:**
- H1: Page title (one per page)
- H2: Major sections
- H3: Subsections
- Include keywords naturally

**Bold & Emphasis:**
- Bold key terms and statistics
- Avoid overuse (dilutes impact)
- Use for scanability

### Alaska-Specific Content Requirements

Every service page must include:

1. **Climate references:**
   - Extreme cold (-40°F or colder)
   - Temperature differentials (80-120°F)
   - Ice dam connection
   - Heating cost context

2. **Location mentions:**
   - Anchorage (primary)
   - Mat-Su Valley, Wasilla, Palmer
   - Eagle River
   - Kenai Peninsula Borough

3. **Local expertise statements:**
   - "Alaska-based"
   - "Understand local conditions"
   - "Serving Alaska homes"

4. **Alaska-specific benefits:**
   - Ice dam prevention
   - Frozen pipe protection
   - Extreme cold performance
   - High heating cost context

---

## Image Requirements

### Image Types Needed Per Page

| Type | Quantity | Purpose |
|------|----------|---------|
| Hero image | 1 | Above-fold visual impact |
| Process photos | 2-4 | Show installation process |
| Before/after | 1-2 | Demonstrate results |
| Completed work | 1-2 | Quality showcase |
| Thermal images | 1-2 | Technical credibility |
| Team/equipment | 1 | Trust building |

### Image Specifications

**File Naming:**
```
[service]-[description]-[location].jpg
```
Examples:
- spray-foam-attic-installation-anchorage.jpg
- crawl-space-encapsulation-completed-alaska.jpg
- ice-dam-prevention-before-after.jpg

**Alt Text Format:**
```
[What's shown] [in/for] [service context] [in location]
```
Examples:
- Professional spray foam insulation application in Anchorage home attic
- Completed crawl space encapsulation with vapor barrier in Alaska home
- Thermal image showing heat loss through uninsulated roof in Anchorage

**Size Requirements:**
- Hero images: 1920x1080px minimum
- Content images: 800x600px minimum
- Thumbnails: 400x300px
- File size: Under 200KB after optimization
- Format: WebP preferred, JPG fallback

---

## Internal Linking Strategy

### Required Internal Links Per Page

**Minimum 8 internal links including:**
1. Main spray foam page (always)
2. 2-3 related service pages
3. Contact page
4. Relevant supporting services
5. About page (occasionally)

### Link Placement

**Natural in-content links:**
- Link when mentioning related services
- Use descriptive anchor text
- Spread throughout content

**Related Services section:**
- 4-5 related services
- Brief description with each
- Contextual explanation of relationship

### Anchor Text Guidelines

**Good:**
- "closed cell spray foam insulation"
- "professional attic insulation"
- "our air sealing services"

**Avoid:**
- "click here"
- "learn more"
- Exact match over-optimization

---

## Conversion Optimization Standards

### CTA Placement

**Required CTA locations:**
1. Hero section (primary + secondary)
2. After problem/benefits section
3. After process section
4. Page bottom (comprehensive)

### CTA Button Text

**Primary CTAs:**
- "Get Free Estimate"
- "Schedule Assessment"
- "Request Quote"
- "Get Started"

**Secondary CTAs:**
- "Call (907) 310-3000"
- "Learn More"
- "See Our Work"

### Trust Signal Placement

**Above fold (3 signals):**
- Certifications/licensing
- Experience (years/projects)
- Guarantee/warranty

**Mid-page:**
- Customer testimonial
- Before/after visual
- Case study snippet

**Footer area:**
- Full certifications list
- Contact information
- Service area

---

## Quality Checklist

### Before Publishing

**Content:**
- [ ] Word count meets target (2,500+ for most pages)
- [ ] All sections complete
- [ ] Alaska-specific content included
- [ ] Technical accuracy verified
- [ ] No spelling/grammar errors
- [ ] Tone is professional and approachable

**SEO:**
- [ ] Title tag optimized (under 60 chars)
- [ ] Meta description written (under 155 chars)
- [ ] H1 unique and keyword-optimized
- [ ] H2/H3 structure logical
- [ ] Primary keyword in first paragraph
- [ ] 8+ internal links included
- [ ] Schema markup implemented

**Conversion:**
- [ ] 4+ CTAs placed throughout
- [ ] Phone number click-to-call
- [ ] Contact form functional
- [ ] Trust signals visible
- [ ] Testimonial included

**Technical:**
- [ ] Images optimized (WebP, under 200KB)
- [ ] All images have alt text
- [ ] Mobile responsive verified
- [ ] Page speed acceptable (<3 seconds)
- [ ] No broken links

---

## Page Priority Matrix

### Phase 1 (Week 1-2) - Critical

| Page | Priority | Est. Hours |
|------|----------|------------|
| Spray Foam Insulation (main) | Critical | 12-16 |
| Attic Insulation | Critical | 12-14 |
| Ice Dam Prevention | High | 12-14 |
| Crawl Space Insulation | High | 12-14 |

### Phase 2 (Week 3-4) - High Priority

| Page | Priority | Est. Hours |
|------|----------|------------|
| Closed Cell Spray Foam | High | 10-12 |
| Open Cell Spray Foam | High | 8-10 |
| Air Sealing | Medium | 8-10 |
| Thermal Inspections | Medium | 8-10 |

### Phase 3 (Week 5-6) - Medium Priority

| Page | Priority | Est. Hours |
|------|----------|------------|
| Commercial Insulation | Medium-High | 10-12 |
| Weatherization | Medium | 8-10 |
| Energy Audits | Medium | 8-10 |
| New Construction | Medium | 8-10 |

### Phase 4 (Week 7-8) - Completion

| Page | Priority | Est. Hours |
|------|----------|------------|
| Wall Insulation | Low-Medium | 10-12 |
| Retrofit Insulation | Low-Medium | 8-10 |
| Insulation Removal | Low | 6-8 |

---

## Revision & Update Guidelines

### Content Review Schedule

**Monthly:**
- Check for outdated pricing
- Verify rebate/incentive accuracy
- Review competitor changes

**Quarterly:**
- Refresh testimonials
- Update statistics
- Add new project photos
- Review keyword performance

**Annually:**
- Comprehensive content audit
- Major updates if needed
- New service additions

### Performance Triggers for Update

Update page if:
- Rankings drop 5+ positions
- Bounce rate exceeds 60%
- Time on page under 2 minutes
- Conversion rate drops 20%+
- Competitor significantly outranks

---

*Document Version: 1.0*
*Created: December 2024*
*Author: Foamology Insulation Content Team*
