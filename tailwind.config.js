/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {
      colors: {
        background: "#FAF0CA",  // the background color of the page
        primary: "#F8F8FF",     // off -white the card background
        secondary: "#F7DF8B",   // the yellowish background
        accent: "#133048",      // the dark blue color
        red: "#E7310E",
        green: "#27C124",
      },
    },
  },
  plugins: [],
};
