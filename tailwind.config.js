/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
      },
      keyframes: {
        spinY: {
          '0%': { transform: 'rotateY(0deg)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'rotateY(360deg)', opacity: '0' },
        },
      },
      animation: {
        spinY: 'spinY 0.6s ease-in-out',
      },
    },
  },
  plugins: [],
};