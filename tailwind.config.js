/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./node_modules/flowbite-react/lib/**/*.js",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["Merriweather", "serif"],
      mono: ["Roboto Mono", "monospace"],
      raleway: ["Raleway", "sans-serif"],
      roboto: ["Roboto", "sans-serif"]
    },
    extend: {
      colors: {
        secondary: "#F7DF8B",   // yellow
        background: "#white",  // the background color of the page
        accent: "#133048",      // the dark blue color
        cred: "#E7310E",
        cgreen: "#27C124",
      },
      textShadow: {
        'custom': '2px 2px 4px rgba(0, 0, 0, 0.3)',
      },
      container: {
        padding: '1rem',
        center: true,
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow-custom': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        },
      }, ['responsive', 'hover']);
    },
    require("flowbite/plugin")
  ],
};
