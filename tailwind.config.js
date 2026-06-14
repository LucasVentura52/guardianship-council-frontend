/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './data/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B63E5',
        secondary: '#047857',
        accent: '#F59E0B',
        background: '#F8FAFC'
      }
    }
  },
  plugins: []
};
