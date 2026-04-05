/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0c0a1a',
        foreground: '#eeedf5',
        primary: '#a855f7',
        secondary: '#38bdf8',
        accent: '#f472b6',
        lime: '#a3e635',
        coral: '#fb7185',
        muted: '#16132a',
        border: 'rgba(255, 255, 255, 0.08)',
        card: '#1a1730',
      },
      fontFamily: {
        heading: ['"Outfit"', 'sans-serif'],
        body: ['"Sora"', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'blob': {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(30px,-50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px,20px) scale(0.9)' },
        },
      },
      animation: {
        'blob': 'blob 7s ease-in-out infinite',
        'blob-slow': 'blob 12s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
