/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        foreground: '#F3F4F6',
        primary: '#9d00ff',     
        secondary: '#00f0ff',   
        accent: '#ff003c',      
        muted: '#151520',       
        border: 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
