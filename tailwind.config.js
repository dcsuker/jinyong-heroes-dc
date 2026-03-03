/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#1a1408', light: '#2d2418', dark: '#0d0a04' },
        gold: { DEFAULT: '#c8a96e', light: '#e8c98e', dark: '#a08040' },
        crimson: { DEFAULT: '#8b1a1a', light: '#b02020', dark: '#5a1010' },
        parchment: { DEFAULT: '#f5f0e8', dark: '#e8e0d0' },
      },
      fontFamily: {
        kai: ['"Noto Serif SC"', 'serif'],
      },
      keyframes: {
        'float-up': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-60px)' }
        },
        'ink-drip': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' }
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px #c8a96e, 0 0 10px #c8a96e' },
          '50%': { boxShadow: '0 0 20px #c8a96e, 0 0 30px #c8a96e' }
        }
      },
      animation: {
        'float-up': 'float-up 1s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-in',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      }
    }
  },
  plugins: []
}
