const { nextui } = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'textdark' :'#191A15',
        'textdark-900' :'#191A15',
        'textdark-100' :'#0D0D25',
        'textlight' :'#7E8492',
        'themeblue': '#004BDE',
        // 'second': '#47019d',
        // 'three': '#e00256',
        // 'black': '#212121',
        // 'white': '#ffffff',
        // 'gray': '#808080e2'
      },
      fontFamily: {
        "Roboto": ['Roboto', 'sans-serif']
      }
    },
  },
  plugins: [nextui()],
}

