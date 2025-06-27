/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/notechain_frontend/index.html",
    "./src/notechain_frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'media' if you prefer OS setting
  theme: {
    extend: {
      colors: {
        'primary': '#10B981', // Emerald 500
        'secondary': '#059669', // Emerald 600
        'background': '#111827', // Gray 900
        'surface': '#1F2937', // Gray 800
        'text-primary': '#F9FAFB', // Gray 50
        'text-secondary': '#D1D5DB', // Gray 300
      }
    },
  },
  plugins: [],
}
