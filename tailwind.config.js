module.exports = {
  content: ['./src/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  purge: ['./src/**/*.jsx', './src/**/*.tsx', './src/**/*.scss', './src/**/*.css'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        sanJuan: '#2B5876',
        eastBay: '#4E4376',
        queenBlue: '#446699',
        queenBlueHover: '#5977A4'
      }
    }
  },
  variants: {
    extend: {}
    // fontFamily: {
    //   sans: ['Inter', 'ui-sans-serif', 'system-ui']
    // }
  },
  plugins: []
};
