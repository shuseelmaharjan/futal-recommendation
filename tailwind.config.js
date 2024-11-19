module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      center: true, 
      screens: {
        DEFAULT: '100%',
        sm: '100%',
        md: '800px', 
        lg: '900px',
        xl: '1000px',
      },
    },
  },
  plugins: [],
}
