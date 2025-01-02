/** @type {import('tailwindcss').Config} */
export default {
  important : true,
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        headerBackground: '#021D2A',
        bodyBackground: '#012B40',
        secondaryColor: '#FFDEA0',
        contactBackground: '#021D2A',
      },
      width: {
        mainContainer: '1320px',
      },
    },
  },
  plugins: [],
}

