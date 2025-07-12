import React from 'react';

const LogoScroller: React.FC = () => {
  // Logo data with placeholder names
  const logos = [
    { 
      name: 'SPFA',
      url: '/images/logos/spfa-logo.svg',
      alt: 'Spray Polyurethane Foam Alliance'
    },
    { 
      name: 'Contractors Choice',
      url: '/images/logos/contractors-choice-logo.svg',
      alt: 'Contractors Choice Agency'
    },
    { 
      name: 'Huntsman',
      url: '/images/logos/huntsman-logo.svg',
      alt: 'Huntsman Building Solutions'
    },
    { 
      name: 'Energy Star',
      url: '/images/logos/energy-star-logo.svg',
      alt: 'Energy Star Certified'
    },
    { 
      name: 'Better Buildings',
      url: '/images/logos/better-buildings-logo.svg',
      alt: 'Better Buildings Challenge'
    }
  ];

  // Duplicate logos for seamless scrolling
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden py-8 bg-gradient-to-t from-charcoal/20 to-transparent">
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-charcoal/40 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-charcoal/40 to-transparent z-10"></div>
        
        {/* Scrolling container */}
        <div className="flex items-center">
          <div className="flex items-center gap-16 animate-scroll">
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                className="flex-shrink-0 px-4"
              >
                <img
                  src={logo.url}
                  alt={logo.alt}
                  className="h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                  style={{
                    filter: 'brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))'
                  }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoScroller;
