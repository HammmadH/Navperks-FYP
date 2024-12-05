

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "bounce-smooth": "bounce-smooth 2s ease-in-out infinite",
      },
      keyframes: {
        "bounce-smooth": {
          "0%, 100%": { transform: "translateY(-5px)" },
          "50%": { transform: "translateY(5px)" },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}