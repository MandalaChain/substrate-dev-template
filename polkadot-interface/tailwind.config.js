/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'polkadot': {
          'primary': '#E6007A',
          'secondary': '#552BBF',
          'light': '#FCE8F3',
          'dark': '#1E1E1E',
        }
      }
    },
  },
  plugins: [],
}