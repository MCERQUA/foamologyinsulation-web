import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const GlassNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '#services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '#contact-form' },
  ];

  return (
    <>
      {/* Dark sand background bar - only when not scrolled */}
      {!isScrolled && (
        <div className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-charcoal/40 to-transparent z-40" />
      )}
      
      <nav className={`fixed top-0 left-0 right-0 z-50 p-4 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto">
          {/* Glass container with multiple layers for depth */}
          <div className="relative">
            {/* Outer glow effect when scrolled */}
            {isScrolled && (
              <div 
                className="absolute inset-0 rounded-3xl opacity-50"
                style={{
                  background: 'radial-gradient(circle at center, rgba(123, 94, 72, 0.1), transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />
            )}
            
            {/* Main glass container */}
            <div
              className={`relative rounded-3xl px-6 py-4 transition-all duration-700 overflow-hidden ${
                isScrolled ? 'glass-navbar-enhanced' : 'bg-transparent'
              }`}
              style={{
                backgroundColor: isScrolled ? 'rgba(123, 94, 72, 0.15)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(24px) saturate(1.8)' : 'none',
                WebkitBackdropFilter: isScrolled ? 'blur(24px) saturate(1.8)' : 'none',
                border: isScrolled ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                boxShadow: isScrolled 
                  ? `0 8px 32px 0 rgba(31, 38, 135, 0.25),
                     inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
                     inset 0 -1px 0 0 rgba(0, 0, 0, 0.1),
                     0 0 0 1px rgba(0, 0, 0, 0.05)` 
                  : 'none',
              }}
            >
              {/* Inner light reflection when scrolled */}
              {isScrolled && (
                <div 
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 30% 0%, rgba(255, 255, 255, 0.15), transparent 50%)',
                  }}
                />
              )}
              
              <div className="relative z-10 flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2 group">
                  <div className={`text-2xl font-bold transition-all duration-300 ${
                    isScrolled ? 'text-espresso' : 'text-soft-white'
                  }`} style={{
                    textShadow: isScrolled ? '0 1px 2px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.5)'
                  }}>
                    Comfort
                  </div>
                  <div className={`text-sm transition-all duration-300 ${
                    isScrolled ? 'text-terra-cotta' : 'text-soft-white/80'
                  }`} style={{
                    textShadow: isScrolled ? '0 1px 2px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.5)'
                  }}>
                    Insulation
                  </div>
                </a>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className={`font-medium transition-all duration-300 hover:text-terra-cotta ${
                        isScrolled ? 'text-espresso' : 'text-soft-white'
                      }`}
                      style={{
                        textShadow: isScrolled ? '0 1px 2px rgba(0, 0, 0, 0.05)' : '0 2px 8px rgba(0, 0, 0, 0.5)'
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                  <button className={`
                    px-6 py-2 rounded-full font-medium transition-all duration-300
                    relative overflow-hidden
                    ${
                      isScrolled 
                        ? 'bg-terra-cotta/60 text-soft-white hover:bg-terra-cotta/70 backdrop-blur-sm border border-terra-cotta/20 shadow-glass' 
                        : 'bg-soft-white/20 text-soft-white border border-soft-white/30 hover:bg-soft-white/30 backdrop-blur-sm'
                    }
                  `}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <span className="relative z-10">Get Quote</span>
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`md:hidden p-2 rounded-xl transition-colors ${
                    isScrolled ? 'hover:bg-espresso/10' : 'hover:bg-soft-white/10'
                  }`}
                  aria-label="Toggle menu"
                >
                  {isOpen ? (
                    <X className={`w-6 h-6 ${isScrolled ? 'text-espresso' : 'text-soft-white'}`} />
                  ) : (
                    <Menu className={`w-6 h-6 ${isScrolled ? 'text-espresso' : 'text-soft-white'}`} />
                  )}
                </button>
              </div>

              {/* Mobile Menu */}
              <div className={`
                md:hidden overflow-hidden transition-all duration-300
                ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}
              `}>
                <div className="space-y-2 py-2">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                        isScrolled 
                          ? 'text-espresso hover:bg-espresso/10' 
                          : 'text-soft-white hover:bg-soft-white/10'
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                  <button className="
                    w-full px-4 py-3 rounded-2xl font-medium transition-all duration-300
                    bg-terra-cotta/60 text-soft-white hover:bg-terra-cotta/70 
                    backdrop-blur-sm border border-terra-cotta/20 shadow-glass
                    relative overflow-hidden
                  ">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <span className="relative z-10">Get Quote</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default GlassNavbar;
