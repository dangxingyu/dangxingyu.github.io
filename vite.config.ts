import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import sourceIdentifierPlugin from 'vite-plugin-source-info'

const isProd = process.env.BUILD_MODE === 'prod'
export default defineConfig({
  plugins: [
    react(),
    sourceIdentifierPlugin({
      enabled: !isProd,
      attributePrefix: 'data-matrix',
      includeProps: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "/blog": path.resolve(__dirname, "./blog"),
      buffer: 'buffer',
    },
  },
  define: {
    'global': 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  base: '/', // For GitHub Pages user site (dangxingyu.github.io)
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          framer: ['framer-motion'],
          markdown: ['react-markdown', 'remark-math', 'rehype-katex'],
          syntax: ['react-syntax-highlighter']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
})

