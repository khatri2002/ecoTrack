/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#60B45A', //TODO: avoid hardcoding
          100: '#E8F4E7',
          200: '#C5E2C4',
          300: '#A2CFA1',
          400: '#80BD7E',
          500: '#60B45A', // default
          600: '#539849',
          700: '#437938',
          800: '#335928',
          900: '#223A18',
        }
      }
    },
  },
  plugins: [],
}

