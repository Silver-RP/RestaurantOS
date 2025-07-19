/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import lineClamp from '@tailwindcss/line-clamp';

export default {
  important: true,
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '500px',
        ...defaultTheme.screens,
      },
      gridTemplateColumns: {
        '15': 'repeat(15, minmax(0, 1fr))',
      },
      colors: {
        mode: 'legacy',
        facebook: '#1877F2',
        headerBackground: '#021D2A',
        bodyBackground: '#012B40',
        secondaryColor: '#FFDEA0',
        hr: '#03486B',
        grayText: '#BBBBBB',
        adminbg: '#F9FAFB',
        admincard: '#FFFFFF',
        admintext: '#1F2937',
        adminprimary: '#3B82F6',
        adminborder: '#E5E7EB',
        adminhover: '#F3F4F6',
        adminsubtle: '#6B7280',
        admingreen: '#10B981',
        adminyellow: '#F59E0B',
        adminred: '#EF4444',
        adminbg: '#F9FAFB',
        admincard: '#FFFFFF',
        admintext: '#1F2937',
        adminprimary: '#3B82F6',
        adminborder: '#E5E7EB',
        adminhover: '#F3F4F6',
        adminsubtle: '#6B7280',
        admingreen: '#10B981',
        adminyellow: '#F59E0B',
        adminred: '#EF4444',
      },
      width: {
        mainContainer: '80%',
        container95: '95%',
      },
      fontFamily: {
        sans: ['Manrope', ...defaultTheme.fontFamily.sans],
        restora: ['Restora', ...defaultTheme.fontFamily.serif],
        roboto: ['Roboto', ...defaultTheme.fontFamily.sans],
        poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
        heading: ['Restora', ...defaultTheme.fontFamily.serif],
        button: ['Poppins', ...defaultTheme.fontFamily.sans],
        body: ['Roboto', ...defaultTheme.fontFamily.sans],
        cormorant: ["'Cormorant Garamond'", 'serif'],
        handwriting: ['"Passions Conflict"', 'cursive'],
      },
      animation: {
        'bounce-slow': 'bounce 2.5s infinite',
        'fade-down': 'fadeDown 1s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        shake: 'shake 0.6s ease-in-out infinite',
  
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
        fadeDown: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-4px)' },
          '40%': { transform: 'translateX(4px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        
      },
    },
  },
  plugins: [lineClamp],
};
