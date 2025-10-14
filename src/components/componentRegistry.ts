// Component Registry
// This file serves as the central index for all components in the project
// It helps track available components and their locations

export const componentRegistry = {
  // UI Components
  ui: {
    GlassButton: {
      path: '@components/ui/GlassButton',
      description: 'Glass morphism button with hover effects',
      props: ['children', 'href', 'variant', 'size']
    },
    GlassCard: {
      path: '@components/ui/GlassCard',
      description: 'Glass morphism card container',
      props: ['children', 'className', 'variant']
    },
    FloatingContactButton: {
      path: '@components/ui/FloatingContactButton',
      description: 'Floating phone icon for contact',
      props: []
    },
    GlassNavbar: {
      path: '@components/ui/GlassNavbar',
      description: 'Glass effect navigation bar with scroll effects',
      props: []
    },
    GalleryGrid: {
      path: '@components/ui/GalleryGrid',
      description: 'Image gallery grid with lightbox modal and category filtering',
      props: ['images', 'columns']
    }
  },
  
  // Section Components
  sections: {
    Hero: {
      path: '@components/sections/Hero',
      description: 'Hero section with static background image',
      props: [],
      images: ['Comfort-Insulation-Arizona-hero1.png - hero background']
    },
    Services: {
      path: '@components/sections/Services',
      description: 'Services section with three service cards',
      props: []
    },
    BlogSection: {
      path: '@components/sections/BlogSection',
      description: 'Blog preview section',
      props: [],
      images: ['blog thumbnails - in /public/images/blog/']
    },
    GalleryShowcase: {
      path: '@components/sections/GalleryShowcase',
      description: 'Gallery preview section showing 8 featured project images with category counts and links to full gallery page',
      props: [],
      images: ['Pulls from gallery-images.ts - 93 total project photos']
    },
    ContactForm: {
      path: '@components/sections/ContactForm',
      description: 'Netlify contact form section',
      props: []
    },
    Footer: {
      path: '@components/sections/Footer',
      description: 'Site footer with company info',
      props: []
    }
  },

  // Service Pages
  services: {
    SprayFoam: {
      path: '@pages/services/spray-foam',
      description: 'Closed cell spray foam insulation service page with vapor barrier comparison',
      props: []
    },
    CrawlSpace: {
      path: '@pages/services/crawl-space-insulation',
      description: 'Crawl space insulation and encapsulation service page',
      props: []
    },
    ThermalInspections: {
      path: '@pages/services/thermal-inspections',
      description: 'Thermal imaging and infrared inspection service page',
      props: []
    },
    InsulationRemoval: {
      path: '@pages/services/insulation-removal',
      description: 'Old insulation removal and replacement service page',
      props: []
    },
    Weatherization: {
      path: '@pages/services/weatherization',
      description: 'Comprehensive weatherization and energy audit page with extensive home performance content, blower door testing, and house-as-a-system approach',
      props: []
    },
    BuildingConsultant: {
      path: '@pages/services/building-consultant',
      description: 'Building science consulting for architects, contractors, and building owners',
      props: []
    }
  },
  
  // Layout Components
  layouts: {
    BaseLayout: {
      path: '@layouts/BaseLayout',
      description: 'Base layout wrapper for all pages',
      props: ['title', 'description']
    },
    BlogLayout: {
      path: '@layouts/BlogLayout',
      description: 'Layout for blog posts',
      props: ['title', 'description', 'pubDate']
    }
  },
  
  // Asset Paths
  assets: {
    images: {
      public: '/public/images/',
      src: '/src/assets/images/',
      usage: 'See IMAGE_GUIDE.md for details'
    }
  },
  
  // Color Palette
  colors: {
    primary: {
      cream: '#FAF7F2',
      sand: '#E8DCC4',
      khaki: '#C8B89E',
      taupe: '#A69580',
      espresso: '#4A3F36',
      charcoal: '#2C2826'
    },
    accent: {
      'terra-cotta': '#C17767',
      'sage-accent': '#8B9D83', // Reserved for eco sections
      'soft-white': '#FEFDFB'
    }
  }
};

// Helper function to get component info
export function getComponentInfo(category: string, componentName: string) {
  return componentRegistry[category]?.[componentName];
}

// Helper function to list all components in a category
export function listComponents(category?: string) {
  if (category) {
    return Object.keys(componentRegistry[category] || {});
  }
  return Object.keys(componentRegistry).reduce((acc, cat) => {
    acc[cat] = Object.keys(componentRegistry[cat]);
    return acc;
  }, {});
}
