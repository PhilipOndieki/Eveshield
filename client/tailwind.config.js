/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'soft-pink': '#FFB6C1',
        'deep-rose': '#E91E63',
        'pale-pink': '#FFF0F5',

        // Neutral Colors
        'dark-charcoal': '#2D2D2D',
        'warm-gray': '#666666',
        'light-gray': '#F5F5F5',

        // Alert Severity Colors
        'concern': '#FFA726',      // Level 1
        'immediate': '#FF6B6B',     // Level 2
        'critical': '#D32F2F',      // Level 3

        // Status Colors
        'success-green': '#66BB6A',
        'warning-orange': '#FFA726',
        'error-red': '#D32F2F',
        'info-blue': '#42A5F5',
      },
    },
  },
  plugins: [],
}
