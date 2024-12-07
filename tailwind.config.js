const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './node_modules/flowbite-react/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-roboto)', ...fontFamily.sans],
      },
      backgroundImage: {
        'hero-pattern':"url('/images/wp10615910.webp')",
      },
    },
  },
  darkMode: 'media',
  plugins: [require('flowbite/plugin')],
};
