/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bone': {
          50: '#fefefe',
          100: '#fcfcfc',
          200: '#fafafa',
          300: '#f8f8f8',
          400: '#f6f6f6',
          500: '#f4f4f4',
          600: '#e6e6e6',
          700: '#d9d9d9',
          800: '#cccccc',
          900: '#bfbfbf',
        }
      }
    },
  },
  plugins: [],
}
