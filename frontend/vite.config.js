import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0', // or '0.0.0.0' or your local IP
    port: 5174, // default, change if needed
    strictPort: true, // exit if the port is already in use
  }
})
