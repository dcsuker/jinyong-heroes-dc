import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('/node_modules/')) {
            return 'vendor'
          }
          if (id.includes('/src/data/')) {
            return 'game-data'
          }
          if (id.includes('/src/engine/')) {
            return 'game-engine'
          }
          if (id.includes('/src/components/')) {
            return 'ui-components'
          }
        },
      },
    },
  },
  base: './',
})
