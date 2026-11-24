import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

const api = 'http://127.0.0.1:8081'

export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    host: 'localhost',
    port: 5173,
    proxy: {
      '/api': api,
      '/oauth2': api,
      '/login/oauth2': api,
      '^/logout$': api,
    },
  },
  test: { environment: 'jsdom', testTimeout: 10_000, include: ['src/**/*.test.tsx'] },
})
