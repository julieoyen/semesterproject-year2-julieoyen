/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{html,js,ts,jsx,tsx}',
    './auth/**/*.{html,js,ts,jsx,tsx}',
    './profile/**/*.{html,js,ts,jsx,tsx}',
    './listing/**/*.{html,js,ts,jsx,tsx}',
    './src/js/components/*.{html,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF7F11',
        primary_hover: '#E6700F',
        button: {
          DEFAULT: '#006c7a',
          hover: '#008899',
        },
        background: {
          light: '#F6EFDB',
          dark: '#0A2638',
        },
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};
