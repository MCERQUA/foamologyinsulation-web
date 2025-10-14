import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const GlassNavbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine active tab based on current URL
  useEffect(() => {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    
    let activeItem = 'Home'; // Default to first item
    
    if (currentPath === '/') {
      if (currentHash === '#contact-form') activeItem = 'Contact';
      else activeItem = 'Home';
    } else if (currentPath.startsWith('/services')) {
      activeItem = 'Solutions';
    } else if (currentPath.startsWith('/about') || currentPath.startsWith('/gallery')) {
      activeItem = 'About';
    } else if (currentPath.startsWith('/blog')) {
      activeItem = 'Blog';
    }
    
    setActiveTab(activeItem);
  }, []);

  const serviceItems = [
    { label: 'Closed Cell Spray Foam', href: '/services/closed-cell-spray-foam' },
    { label: 'Open Cell Spray Foam', href: '/services/open-cell-spray-foam' },
    { label: 'Attic Insulation', href: '/services/attic-insulation' },
    { label: 'Crawl Space Insulation', href: '/services/crawl-space-insulation' },
    { label: 'Weatherization & Energy Audits', href: '/services/weatherization' },
    { label: 'Thermal Inspections', href: '/services/thermal-inspections' },
    { label: 'Building Science Consulting', href: '/services/building-consultant' },
    { label: 'Insulation Removal', href: '/services/insulation-removal' },
    { label: 'Ice Dam Prevention', href: '/ice-dam-prevention' },
  ];

  const aboutItems = [
    { label: 'About Us', href: '/about' },
    { label: 'Gallery', href: '/gallery' },
  ];

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services', hasDropdown: true, dropdownType: 'services' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'About', href: '/about', hasDropdown: true, dropdownType: 'about' },
    { label: 'Blog', href: '/blog' },
  ];

  const handleNavClick = (itemLabel: string) => {
    setActiveTab(itemLabel);
  };

  return (
    <>
      {/* Dark background bar - only when not scrolled */}
      {!isScrolled && (
        <div className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-charcoal/40 to-transparent z-40" />
      )}
      
      {/* Glass Navbar - Always visible with all menu items */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="relative">
          {/* Outer glow effect */}
          <div 
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle at center, rgba(123, 167, 217, 0.2), transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
          
          {/* Main glass container */}
          <div
            className="relative rounded-full px-4 py-3 transition-all duration-700 overflow-hidden"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(16px) saturate(1.8)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.12),
                         inset 0 1px 0 0 rgba(255, 255, 255, 0.25),
                         inset 0 -1px 0 0 rgba(0, 0, 0, 0.08)`,
            }}
          >
            {/* Inner light reflection */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 100%)',
              }}
            />
            
            {/* Navigation Items Container */}
            <div className="relative z-10 flex items-center gap-1 sm:gap-2">
              {/* Logo - Desktop only */}
              <a href="/" className="hidden lg:flex items-center mr-4 group">
                <img 
                  src="/images/logos/foamology-logo.png" 
                  alt="Foamology Insulation" 
                  className="h-8 w-auto transition-all duration-300"
                  style={{
                    filter: 'brightness(1.2) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
                  }}
                />
              </a>

              {/* Navigation Items - All visible as glass buttons */}
              {navItems.map((item) => {
                const isActive = activeTab === item.label;

                if (item.hasDropdown) {
                  const isServicesDropdown = item.dropdownType === 'services';
                  const isAboutDropdown = item.dropdownType === 'about';
                  const showDropdown = isServicesDropdown ? showServicesDropdown : showAboutDropdown;

                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => isServicesDropdown ? setShowServicesDropdown(true) : setShowAboutDropdown(true)}
                      onMouseLeave={() => isServicesDropdown ? setShowServicesDropdown(false) : setShowAboutDropdown(false)}
                    >
                      <button
                        onClick={() => handleNavClick(item.label)}
                        className={`
                          relative cursor-pointer text-xs sm:text-sm font-medium px-2 sm:px-3 py-2 rounded-full transition-all duration-300 flex items-center gap-1
                          text-white/90 hover:text-white
                          hover:bg-white/10 hover:backdrop-blur-sm
                          hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.1)]
                          ${isActive ? 'bg-white/15 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]' : ''}
                        `}
                      >
                        <span
                          className="relative z-10"
                          style={{
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.6)'
                          }}
                        >
                          {item.label}
                        </span>
                        <ChevronDown
                          size={12}
                          className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                          style={{
                            filter: 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.8))'
                          }}
                        />

                        {/* Active indicator */}
                        {isActive && (
                          <div
                            className="absolute inset-0 w-full rounded-full -z-10"
                            style={{
                              background: `linear-gradient(135deg,
                                rgba(255, 255, 255, 0.15) 0%,
                                rgba(255, 255, 255, 0.08) 50%,
                                rgba(255, 255, 255, 0.15) 100%)`,
                              boxShadow: `
                                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                                inset 0 -1px 0 rgba(0, 0, 0, 0.1),
                                0 0 15px rgba(255, 255, 255, 0.2)
                              `
                            }}
                          >
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 sm:w-8 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full opacity-80">
                              <div className="absolute w-8 sm:w-12 h-4 sm:h-6 bg-white/10 rounded-full blur-md -top-1 sm:-top-2 -left-1 sm:-left-2" />
                              <div className="absolute w-4 sm:w-6 h-4 bg-white/20 rounded-full blur-sm -top-0.5 sm:-top-1 left-1" />
                              <div className="absolute w-2 sm:w-4 h-3 sm:h-4 bg-white/30 rounded-full blur-sm top-0 left-1 sm:left-2" />
                              <div className="absolute w-6 sm:w-10 h-6 sm:h-8 bg-sage-mist/20 rounded-full blur-lg -top-2 sm:-top-3 -left-0.5 sm:-left-1" />
                            </div>
                          </div>
                        )}
                      </button>

                    </div>
                  );
                }

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => handleNavClick(item.label)}
                    className={`
                      relative cursor-pointer text-xs sm:text-sm font-medium px-2 sm:px-3 py-2 rounded-full transition-all duration-300
                      text-white/90 hover:text-white
                      hover:bg-white/10 hover:backdrop-blur-sm
                      hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.1)]
                      ${isActive ? 'bg-white/15 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]' : ''}
                    `}
                  >
                    <span
                      className="relative z-10"
                      style={{
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.6)'
                      }}
                    >
                      {item.label}
                    </span>

                    {isActive && (
                      <div
                        className="absolute inset-0 w-full rounded-full -z-10"
                        style={{
                          background: `linear-gradient(135deg,
                            rgba(255, 255, 255, 0.15) 0%,
                            rgba(255, 255, 255, 0.08) 50%,
                            rgba(255, 255, 255, 0.15) 100%)`,
                          boxShadow: `
                            inset 0 1px 0 rgba(255, 255, 255, 0.3),
                            inset 0 -1px 0 rgba(0, 0, 0, 0.1),
                            0 0 15px rgba(255, 255, 255, 0.2)
                          `
                        }}
                      >
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 sm:w-8 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full opacity-80">
                          <div className="absolute w-8 sm:w-12 h-4 sm:h-6 bg-white/10 rounded-full blur-md -top-1 sm:-top-2 -left-1 sm:-left-2" />
                          <div className="absolute w-4 sm:w-6 h-4 bg-white/20 rounded-full blur-sm -top-0.5 sm:-top-1 left-1" />
                          <div className="absolute w-2 sm:w-4 h-3 sm:h-4 bg-white/30 rounded-full blur-sm top-0 left-1 sm:left-2" />
                          <div className="absolute w-6 sm:w-10 h-6 sm:h-8 bg-sage-mist/20 rounded-full blur-lg -top-2 sm:-top-3 -left-0.5 sm:-left-1" />
                        </div>
                      </div>
                    )}
                  </a>
                );
              })}

              {/* Get Quote Button */}
              <a
                href="/about#contact-form"
                className="
                  ml-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300
                  text-white hover:text-white
                  hover:bg-white/15
                  backdrop-blur-sm border border-white/30 shadow-lg
                  relative overflow-hidden
                "
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  boxShadow: `0 4px 16px 0 rgba(0, 0, 0, 0.1),
                             inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent" />
                <span
                  className="relative z-10"
                  style={{
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  Quote
                </span>
              </a>
            </div>
          </div>

          {/* Animated border glow */}
          <div
            className="absolute inset-0 rounded-full border border-white/20 pointer-events-none animate-pulse"
            style={{
              animationDuration: '3s'
            }}
          />
        </div>
      </nav>

      {/* Services Dropdown - Rendered outside navbar container */}
      {showServicesDropdown && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 w-64 z-50"
          style={{
            animation: 'fadeInScale 0.2s ease-out'
          }}
          onMouseEnter={() => setShowServicesDropdown(true)}
          onMouseLeave={() => setShowServicesDropdown(false)}
        >
          <div
            className="rounded-2xl p-4 border border-white/20 shadow-elegant backdrop-blur-xl overflow-hidden"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
              boxShadow: `0 12px 40px 0 rgba(0, 0, 0, 0.15),
                         inset 0 1px 0 0 rgba(255, 255, 255, 0.25),
                         inset 0 -1px 0 0 rgba(0, 0, 0, 0.08)`,
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 100%)',
              }}
            />

            <div className="relative z-10 space-y-1">
              {serviceItems.map((service) => (
                <a
                  key={service.label}
                  href={service.href}
                  className="block px-3 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  style={{
                    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)'
                  }}
                  onClick={() => setShowServicesDropdown(false)}
                >
                  {service.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* About Dropdown - Rendered outside navbar container */}
      {showAboutDropdown && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 w-48 z-50"
          style={{
            animation: 'fadeInScale 0.2s ease-out'
          }}
          onMouseEnter={() => setShowAboutDropdown(true)}
          onMouseLeave={() => setShowAboutDropdown(false)}
        >
          <div
            className="rounded-2xl p-4 border border-white/20 shadow-elegant backdrop-blur-xl overflow-hidden"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
              boxShadow: `0 12px 40px 0 rgba(0, 0, 0, 0.15),
                         inset 0 1px 0 0 rgba(255, 255, 255, 0.25),
                         inset 0 -1px 0 0 rgba(0, 0, 0, 0.08)`,
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 100%)',
              }}
            />

            <div className="relative z-10 space-y-1">
              {aboutItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  style={{
                    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)'
                  }}
                  onClick={() => setShowAboutDropdown(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlassNavbar;

// Add global styles for the dropdown animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInScale {
      0% {
        opacity: 0;
        transform: scale(0.95) translateY(-10px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `;

  if (!document.querySelector('[data-navbar-styles]')) {
    style.setAttribute('data-navbar-styles', 'true');
    document.head.appendChild(style);
  }
}
