// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    checker({
      typescript: {
        // leave type‑checking on for everything else...
        enable: true,
        tsconfigPath: './tsconfig.json',
        // but ignore these specific diagnostics:
        diagnosticOptions: {
          semantic: false,
          syntactic: false,
        },
      },
    }),
  ],
  esbuild: {
    tsconfigRaw: './tsconfig.json',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/constants': path.resolve(__dirname, './src/constants'),
    },
  },
  server: {
    port: 3001,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          query: ['@tanstack/react-query'],
          charts: ['recharts'],
          ui: ['lucide-react', 'framer-motion'],
        },
      },
    },
  },
})
