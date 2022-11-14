/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        success: "#6DFFA7",
        dark: "#080808",
      },
      fontFamily: {
        popins: ["'Poppins'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
