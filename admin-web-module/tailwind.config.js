import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        primary: {
          DEFAULT: "#60B45A", //TODO: avoid hardcoding
          100: "#E8F4E7",
          200: "#C5E2C4",
          300: "#A2CFA1",
          400: "#80BD7E",
          500: "#60B45A", // default
          600: "#539849",
          700: "#437938",
          800: "#335928",
          900: "#223A18",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
