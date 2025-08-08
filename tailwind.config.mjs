/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/@astrojs/tailwind/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        // Alaska-themed palette - glacier blues and mountain tones
        'cream': '#E3F2FD',           // Glacier Blue - very light blue like fresh snow
        'sand': '#BBDEFB',            // Alaska Sky - soft sky blue from mountain scene
        'sand-dark': '#90CAF9',       // Darker sky blue for cards
        'khaki': '#64B5F6',           // Medium blue
        'taupe': '#42A5F5',           // Deeper blue
        'espresso': '#1565C0',        // Deep blue for text (readable on light backgrounds)
        'charcoal': '#0D47A1',        // Navy blue for high contrast
        'brown-tint': '#1976D2',      // Blue for glass tint
        
        // Accent colors (use sparingly)
        'sage-accent': '#D1C4E9',     // Twilight Blue - gentle purple-blue from evening sky
        'sage-mist': '#CE93D8',       // Soft purple for eco/savings sections
        'terra-cotta': '#AB47BC',     // Purple accent for CTAs
        'soft-white': '#FEFDFB',      // Pure soft white
        
        // Functional colors
        'warm-gray': '#546E7A',       // Blue-gray for secondary text
        'light-gray': '#F3E5F5',      // Very light purple-blue for backgrounds
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'subtle-pulse': 'subtlePulse 3s ease-in-out infinite',
        'scroll': 'scroll 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(184, 148, 111, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(184, 148, 111, 0.5)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
        xl: '20px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'medium': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'elegant': '0 10px 40px rgba(0, 0, 0, 0.15)',
        'text-glow': '0 0 10px rgba(0, 0, 0, 0.5)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
