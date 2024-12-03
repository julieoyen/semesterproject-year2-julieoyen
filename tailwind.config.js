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
      },
      screens: {
        xs: '480px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(20px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        fadeOut: 'fadeOut 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
