/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#005BBE',
          navy: '#003a7d',
        }
      },
      animation: {
        blob: 'blob 14s infinite alternate ease-in-out',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1) rotate(0deg)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.12) rotate(45deg)',
          },
          '66%': {
            transform: 'translate(-25px, 25px) scale(0.92) rotate(-30deg)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1) rotate(0deg)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
