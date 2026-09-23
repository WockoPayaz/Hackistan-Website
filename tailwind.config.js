/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B0C0D',
        'bg-soft': '#111214',
        fg: '#F2F0EA',
        'fg-muted': '#9C9C98',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};