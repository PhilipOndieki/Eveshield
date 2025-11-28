/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Blue Gradient Color Palette (Primary)
        'deep-navy': '#1A2332',      // Darkest - Headers, primary backgrounds
        'medium-navy': '#2C3E50',    // Navigation, secondary backgrounds
        'slate-blue': '#34495E',     // Tertiary backgrounds
        'medium-blue': '#5C7A99',    // Card backgrounds
        'light-blue': '#7B9CB5',     // Hover states, light cards
        'sky-blue': '#A8C5DA',       // Accents, interactive elements
        'pale-blue': '#D4E6F1',      // Very light backgrounds

        // Emergency/Alert Colors (Deep Rose - use sparingly)
        'deep-rose': '#E91E63',      // ONLY for emergency buttons, critical alerts

        // Neutral Colors
        'dark-charcoal': '#2D2D2D',  // Primary text on light backgrounds
        'warm-gray': '#666666',      // Secondary text

        // Alert Severity Colors
        'concern': '#FFA726',        // Level 1
        'immediate': '#FF6B6B',      // Level 2
        'critical': '#D32F2F',       // Level 3

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
