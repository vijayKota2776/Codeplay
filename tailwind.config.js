/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        'y2k-pink': '#FF1493',
        'y2k-cyan': '#00FFFF',
        'y2k-lime': '#00FF00',
        'y2k-dark': '#050816'
      },
    },
  },
  plugins: [],
};
