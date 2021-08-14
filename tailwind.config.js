module.exports = {
  purge: [
    './src/**/*.jsx',
    './src/**/*.tsx',
    './src/**/*.scss',
    './src/**/*.css',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        sanJuan: "#2B5876",
        eastBay: "#4E4376",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
