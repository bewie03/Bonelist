/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: {
          50: '#FFFFF9',
          100: '#FDFDF0',
          200: '#FBFBE0',
          300: '#F7F7C5',
          400: '#F3F3AA',
          500: '#EFEF8F',
        },
        navy: {
          DEFAULT: '#1a237e', // Base navy color
          50: '#E8EAF6',
          100: '#C5CAE9',
          200: '#9FA8DA',
          300: '#7986CB',
          400: '#5C6BC0',
          500: '#3F51B5',
          600: '#1a237e',
          700: '#151B63',
          800: '#101449',
          900: '#0B0D2E',
        },
        bullish: {
          light: '#d1fae5',
          DEFAULT: '#059669',
          dark: '#047857',
        },
        bearish: {
          light: '#fee2e2',
          DEFAULT: '#dc2626',
          dark: '#b91c1c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
