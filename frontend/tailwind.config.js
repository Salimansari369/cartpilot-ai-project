/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0c0d24',
          800: '#131536',
          700: '#1a1d47'
        },
        lavender: {
          50: '#f8f9ff',
          100: '#f0f2fe',
          200: '#e4e7fd',
          300: '#d1d6fb',
          500: '#7c5cfc',
          600: '#6c47ff',
          700: '#5830eb',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
