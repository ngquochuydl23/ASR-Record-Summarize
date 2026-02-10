const { breakpoints, colors, fontFamily, typography } = require('./src/theme/theme.global');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.{html,js,jsx}',
    './src/**/*.{html,js,jsx}', // Add paths to your files that will use Tailwind CSS
  ],
  theme: {
    screens: {
      sm: breakpoints.sm + 'px',
      md: breakpoints.md + 'px',
      lg: breakpoints.lg + 'px',
      xl: breakpoints.xl + 'px',
    },
    extend: {
      colors: colors,
    },
  },
  plugins: [],
}

