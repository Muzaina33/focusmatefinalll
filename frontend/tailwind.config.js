/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#14b8a6', // Softer teal color
        'dark-bg': '#0f172a',
        'dark-card': '#1e293b',
        'dark-panel': '#334155',
      },
      boxShadow: {
        'neon': '0 0 10px rgba(20, 184, 166, 0.3), 0 0 20px rgba(20, 184, 166, 0.2)',
        'neon-sm': '0 0 5px rgba(20, 184, 166, 0.3)',
      },
      backdropBlur: {
        'glass': '10px',
      },
    },
  },
  plugins: [],
}
