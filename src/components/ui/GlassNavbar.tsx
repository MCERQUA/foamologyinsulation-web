import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const GlassNavbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [isScrolled, setIsScrolled] = useState(false);

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
    } else if (currentPath.startsWith('/about')) {
      activeItem = 'About';
    } else if (currentPath.startsWith('/blog')) {
      activeItem = 'Blog';
    }
    
    setActiveTab(activeItem);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Solutions', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/about#contact-form' },
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
                    {/* Text with strong shadow for visibility */}
                    <span 
                      className="relative z-10"
                      style={{
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.6)'
                      }}
                    >
                      {item.label}
                    </span>
                    
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
                        {/* Top LED-style highlight */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 sm:w-8 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full opacity-80">
                          <div className="absolute w-8 sm:w-12 h-4 sm:h-6 bg-white/10 rounded-full blur-md -top-1 sm:-top-2 -left-1 sm:-left-2" />
                          <div className="absolute w-4 sm:w-6 h-4 bg-white/20 rounded-full blur-sm -top-0.5 sm:-top-1 left-1" />
                          <div className="absolute w-2 sm:w-4 h-3 sm:h-4 bg-white/30 rounded-full blur-sm top-0 left-1 sm:left-2" />
                          {/* Sage mist glow to match theme */}
                          <div className="absolute w-6 sm:w-10 h-6 sm:h-8 bg-sage-mist/20 rounded-full blur-lg -top-2 sm:-top-3 -left-0.5 sm:-left-1" />
                        </div>
                      </div>
                    )}
                  </a>
                );
              })}

              {/* Get Quote Button */}
              <button 
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
              </button>
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
    </>
  );
};

export default GlassNavbar;
