import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const root = path.resolve(__dirname, 'src', 'client')

export default defineConfig({
  root,
  plugins: [vue()],
  base: process.env.NODE_ENV === 'development' ? '/' : './',
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(root) },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js',
      },
    ],
  },
  server: {
    open: false, // do not open the browser as we use electron
    port: Number(process.env.PORT) || 3333,
  },
  build: {
    outDir: path.resolve(root, '..', 'public'),
  },
  optimizeDeps: {
    exclude: ['vue-wind'],
  },
})
