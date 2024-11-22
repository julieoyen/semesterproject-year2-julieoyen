/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{html,js,ts,jsx,tsx}',
    './listings/**/*.{html,js,ts,jsx,tsx}',
    './profile/index.{html,js,ts,jsx,tsx}',
    './login/index.{html,js,ts,jsx,tsx}',
    './register/register.{html,js,ts,jsx,tsx}',
    './src/**/**/*.{html,js,ts,jsx,tsx}',
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
        xs: '480px', // Define a custom breakpoint for extra-small screens
      },
    },
  },
  plugins: [],
};
