/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        duo: {
          green: '#E8A0BF',
          'green-hover': '#D98BA8',
          'green-dark': '#C97B95',
          'green-light': '#FCE7EC',
          red: '#D48484',
          'red-light': '#FCE8E8',
          dark: '#5C4A4A',
          gray: '#FDF2F4',
          'gray-border': '#E8D4D8',
        },
        wedding: {
          pink: '#FFE5EC',
          rose: '#FFC2D1',
          purple: '#E7C6E8',
          lavender: '#D4A5D8',
          gold: '#F4D9C6',
        }
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        display: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        script: ['Great Vibes', 'cursive'],
      },
      boxShadow: {
        duo: '0 4px 0 0 #C97B95, 0 6px 10px rgba(0, 0, 0, 0.06)',
        'duo-card': '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
