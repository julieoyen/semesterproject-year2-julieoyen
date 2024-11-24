/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{html,js,ts,jsx,tsx}',
    './src/**/**/*.{html,js,ts,jsx,tsx}',
    './auth/**/*.{html,js,ts,jsx,tsx}',
    './profile/**/*.{html,js,ts,jsx,tsx}',
    './src/js/**/*.{html,js,ts,jsx,tsx}',
    './src/js/**/**/*.{html,js,ts,jsx,tsx}',
    './listing/**/*.{html,js,ts,jsx,tsx}',
    '/',
  ],
  theme: {
    extend: {
      colors: {
        primary_button: '#B7E949',
        primary_button_hover: '#9ACF3A',
        secondary: '#2320E8',
        background_white: '#FCFAFA',
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
