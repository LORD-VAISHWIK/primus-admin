import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    rollupOptions: {
      external: [],
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
  },
  optimizeDeps: {
    include: ['lucide-react', 'react', 'react-dom'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})
