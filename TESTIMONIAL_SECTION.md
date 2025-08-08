# Testimonial Section Implementation

## Overview
Added a new testimonial/review section to the homepage between Services and Latest Insights sections.

## Components Created:

### 1. TestimonialCard.tsx
- Interactive card component with drag-to-shuffle functionality
- Uses Framer Motion for smooth animations
- Cards stack with rotation effect (front: -6deg, middle: 0deg, back: 6deg)
- Drag gesture support on the front card
- Custom styling with sand color palette

### 2. TestimonialSection.tsx
- React component that manages the testimonial cards state
- Handles shuffling logic when cards are dragged
- Displays up to 3 cards at a time in a stacked formation

### 3. TestimonialSection.astro
- Astro wrapper component for the testimonial section
- Dark sand background (bg-brown-tint) for contrast
- Contains 5 testimonials from Arizona homeowners
- Responsive design with mobile-friendly instructions

## Design Features:

### Color Scheme:
- Background: `brown-tint` (#7B5E48) - darker than other sections
- Card background: `khaki/20` with backdrop blur
- Text colors: `soft-white` (headings), `cream` (testimonials), `sand` (company names)
- Border: `sand-dark/30` for subtle definition

### Visual Effects:
- Stacked cards with rotation animation
- Drag-to-shuffle interaction (swipe on mobile)
- Backdrop blur for glass effect
- Subtle background pattern
- Decorative blur elements

### Testimonials Include:
1. Sarah Johnson - Phoenix Homeowner (35% energy savings)
2. Michael Chen - Scottsdale Resident (attic insulation)
3. Jennifer Martinez - Tempe Homeowner (crawl space)
4. Robert Davis - Mesa Property Owner (service quality)
5. Emily Thompson - Chandler Resident (noise reduction)

## Integration:
- Added to homepage between Services and Blog sections
- Provides social proof and builds trust
- Creates visual break with contrasting dark background
- Maintains consistent design language with rest of site

## User Interaction:
- Desktop: Drag cards left to shuffle through testimonials
- Mobile: Swipe gesture to see more reviews
- Smooth animations powered by Framer Motion
