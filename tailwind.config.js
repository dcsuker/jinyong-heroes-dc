/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ink-black': '#1a1a1a',
        'ink-gray': '#4a4a4a',
        'ink-light': '#8a8a8a',
        'paper': '#f5f5f0',
        'cinnabar': '#c41e3a',
        'gold': '#d4af37',
        'jade': '#00a86b',
        'azure': '#4a90a4',
      },
      fontFamily: {
        'serif': ['Noto Serif SC', 'SimSun', 'serif'],
        'sans': ['Noto Sans SC', 'SimHei', 'sans-serif'],
      },
      animation: {
        'ink-flow': 'inkFlow 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'damage-float': 'damageFloat 1s ease-out',
      },
      keyframes: {
        inkFlow: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        damageFloat: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-20px)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
