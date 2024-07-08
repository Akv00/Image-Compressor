/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient": "linear-gradient(263deg, #DBDCFF -2.32%, #E7F7FF 47.65%, #D3E7FF 112.56%)",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};


