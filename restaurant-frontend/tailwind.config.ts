/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
export default {
  important : true,
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        '15': 'repeat(15, minmax(0, 1fr))',
      },
      colors: {
        facebook: '#1877F2',
        headerBackground: '#021D2A',
        bodyBackground: '#012B40',
        secondaryColor: '#FFDEA0',
        contactBackground: '#021D2A',
        hr: '#03486B',
      },
      width: {
        mainContainer: '98%',
      },
      fontFamily: {
        sans: ['Manrope', ...defaultTheme.fontFamily.sans],
        restora: ['Restora'],
        cormorant: ["'Cormorant Garamond'", "serif"]
      },
      animation: {
        'fade-down': 'fadeDown 1s ease-out',
      },
      keyframes: {
        fadeDown: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

