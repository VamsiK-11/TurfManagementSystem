import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/turfs': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/bookings': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/payments': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})