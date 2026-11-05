/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1F3D2B',
          dark: '#142B20',
          surface: '#193426',
          subtle: '#101A14',
        },
        beige: {
          DEFAULT: '#E8DCC4',
          light: '#F4EBDD',
          muted: '#C9BDA7',
        },
        purple: {
          DEFAULT: '#8B5CF6',
          hover: '#A78BFA',
          dark: '#7040D5',
        },
        // Semantic aliases
        primary: {
          DEFAULT: '#8B5CF6',
          hover: '#A78BFA',
          dark: '#7040D5',
        },
        surface: '#193426',
        background: '#1F3D2B',
        'forest-dark': '#142B20',
        'forest-surface': '#193426',
        'sand-beige': '#E8DCC4',
        'light-beige': '#F4EBDD',
        'muted-beige': '#C9BDA7',
        'electric-purple': '#8B5CF6',
        'purple-hover': '#A78BFA',
        'purple-dark': '#7040D5',
        'subtle-dark': '#101A14',
      },
      fontFamily: {
        heading: ['"Sora"', '"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Sora"', '"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        stat: ['"Space Grotesk"', 'sans-serif'],
      },
      borderRadius: {
        'card': '18px',
        'large': '24px',
        'btn': '12px',
        '4xl': '2rem',
      },
      boxShadow: {
        'purple-glow': '0 0 25px rgba(139, 92, 246, 0.25)',
        'purple-glow-lg': '0 10px 40px -10px rgba(139, 92, 246, 0.40)',
        'card-subtle': '0 12px 30px -10px rgba(16, 26, 20, 0.6)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
