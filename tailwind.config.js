/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554"}
      },
      animation: {
        "bounce-smooth": "bounce-smooth 2s ease-in-out infinite",
        'car-vanish': 'vanish 3s ease-in-out',
        'car-vanish-2': 'vanish2 3s ease-in-out',
        'car-vanish-3': 'vanish3 3s ease-in-out',
      },
      keyframes: {
        "bounce-smooth": {
          "0%, 100%": { transform: "translateY(-5px)" },
          "50%": { transform: "translateY(5px)" },
        },
        vanish: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-300px)', opacity: '0' },
        },
        vanish2: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-200px)', opacity: '0' },
        },
        vanish3: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100px)', opacity: '0' },
        },
      },
    },
  },
  plugins: [// Require only if you want to use FlyonUI JS component
  ]
}