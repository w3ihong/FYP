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
        background: "#FAF0CA",
        primary: "#F8F8FF",
        secondary: "#F7DF8B",
        accent: "#133048",
        red: "#E7310E",
        green: "#27C124",
      },
    },
  },
  plugins: [],
};
