/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',    // your React files
  ],
  theme: {
    extend: {
      colors: {
        'y2k-cyan': '#00f0ff',
        'y2k-pink': '#ff00ff',
        'y2k-yellow': '#ffd600',
        'y2k-lime': '#00ff7f',
      },
      fontFamily: {
        bitcount: ['Bitcount Prop Single', 'system-ui'],
        syne: ['Syne', 'sans-serif'],
      },
      dropShadow: {
        brutal: '0 4px 0 #000',
      },
      boxShadow: {
        brutal: '0 5px 0 #000, 1px 6px 0.5px #FEE882',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(35px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: 0, transform: 'translateX(-55px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        popIn: {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '90%': { opacity: 1, transform: 'scale(1.06)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        squishy: {
          '0%': { opacity: 0, transform: 'scale(0.95) translateY(28px)' },
          '50%': { opacity: 1, transform: 'scale(1.16) translateY(-10px)' },
          '65%': { opacity: 1, transform: 'scale(0.97) translateY(3px)' },
          '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp .78s cubic-bezier(.41,.81,.62,1.09) both',
        fadeInLeft: 'fadeInLeft .7s cubic-bezier(.41,.81,.62,1.09) both',
        popIn: 'popIn .6s cubic-bezier(.41,.81,.62,1.09) both',
        squishy: 'squishy .8s cubic-bezier(.5,1.5,.62,1.09) both',
      },
    },
  },
  plugins: [],
};
