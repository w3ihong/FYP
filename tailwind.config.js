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
      mono: ["Roboto Mono", "monospace"],
    },
    extend: {
      colors: {
        background: "#FAF0CA",  // the background color of the page
        primary: "#F8F8FF",     // off -white the card background
        secondary: "#F7DF8B",   // the yellowish background also sued for card
        accent: "#133048",      // the dark blue color ,side bar and text
        cred: "#E7310E",
        cgreen: "#27C124"
      },
      textShadow: {
        'custom': '2px 2px 4px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow-custom': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        },
      }, ['responsive', 'hover']);
    }
  ],
};
