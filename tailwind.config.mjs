/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/@astrojs/tailwind/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        // Main palette - warm, comfortable, professional
        'cream': '#FAF7F2',           // Light cream background
        'sand': '#E8DCC4',            // Warm sand
        'sand-dark': '#D4C4A8',       // Darker sand for cards
        'khaki': '#C8B89E',           // Medium khaki
        'taupe': '#A69580',           // Darker taupe
        'espresso': '#4A3F36',        // Dark brown for text
        'charcoal': '#2C2826',        // Almost black for high contrast
        'brown-tint': '#7B5E48',      // Brown for glass tint
        
        // Accent colors (use sparingly)
        'sage-accent': '#8B9D83',     // Muted sage for eco sections only
        'sage-mist': '#9FA897',       // Sage green for eco/savings sections
        'terra-cotta': '#B8946F',     // Changed to tan/brown for CTAs
        'soft-white': '#FEFDFB',      // Pure soft white
        
        // Functional colors
        'warm-gray': '#8B8680',       // For secondary text
        'light-gray': '#F5F2ED',      // For backgrounds
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
