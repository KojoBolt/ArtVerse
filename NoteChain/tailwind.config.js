/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: [
    "./src/notechain_frontend/index.html",
    "./src/notechain_frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Keeping class-based dark mode
  theme: {
    extend: {
      colors: {
        // New Web3-inspired palette
        'brand-primary': '#7C3AED', // Vibrant Purple (Violet-600)
        'brand-secondary': '#DB2777', // Vibrant Pink (Pink-600)
        'brand-accent': '#22D3EE', // Bright Cyan (Cyan-400)

        'neutral-darkest': '#111827', // Gray 900 (existing background)
        'neutral-darker': '#1F2937',  // Gray 800 (existing surface)
        'neutral-dark': '#374151',    // Gray 700
        'neutral-medium': '#6B7280',  // Gray 500
        'neutral-light': '#D1D5DB',   // Gray 300 (existing text-secondary)
        'neutral-lighter': '#F3F4F6', // Gray 100
        'neutral-lightest': '#F9FAFB',// Gray 50 (existing text-primary)

        // Status colors
        'status-success': '#10B981', // Emerald 500
        'status-error': '#EF4444',   // Red 500
        'status-warning': '#F59E0B', // Amber 500
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans], // Keep Inter, ensure it's properly configured
      },
      // Example for custom gradients (can be applied with bg-gradient-to-r from-brand-primary to-brand-secondary etc.)
      // Or define specific gradient classes if needed, though Tailwind's built-in gradient utilities are quite flexible.
      backgroundImage: {
        'gradient-primary-secondary': 'linear-gradient(to right, #7C3AED, #DB2777)',
        'gradient-accent-glow': 'radial-gradient(ellipse at center, #22D3EEaa, transparent 60%)',
      },
      boxShadow: {
        'glow-accent': '0 0 15px 5px rgba(34, 211, 238, 0.3)', // Cyan glow
        'glow-primary': '0 0 15px 5px rgba(124, 58, 237, 0.3)', // Purple glow
      },
      // For Glassmorphism (backdrop blur needs to be enabled in global CSS or a plugin if not default)
      // Tailwind includes backdrop-filter utilities by default if filter plugin is enabled (it is by default)
      // So, you can use classes like `backdrop-blur-md bg-neutral-darker/70`
      animation: {
        'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      transitionDelay: { // Adding some common delay utilities
        '0': '0ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Useful for form styling resets
    // require('@tailwindcss/typography'), // If we want to style markdown/html content easily (e.g. for NoteView)
  ],
}
