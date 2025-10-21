module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
      },
      colors: {
        lime: {
          400: '#b3ff00',
          500: '#a0ff00',
        },
      },
    },
  },
  plugins: [],
}
