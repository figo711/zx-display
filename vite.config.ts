import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@terra-money/terra.js': '@terra-money/terra.js/dist/bundle.js',
      'readable-stream': 'vite-compatible-readable-stream',
      '@walletconnect/socket-transport': '@walletconnect/socket-transport/dist/umd/index.min.js'
    }
  },
  define: {
    global: "globalThis",
  },
  clearScreen: false,
  server: {
    strictPort: true,
  },
  build: {
    target: ['es2021', 'chrome100', 'safari13'],
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },

  envPrefix: ['VITE_', 'TAURI_'],
  plugins: [react()]
})
