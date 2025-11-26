import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'public/popup.html'),
        main: resolve(__dirname, 'index.html')
      }
    },
    outDir: 'dist'
  }
})
