import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'


export default defineConfig({
    plugins: [vue()],
    base: process.env.NODE_ENV === 'development' ? '/' : './',
    server: {
        open: false, // do not open the browser as we use electron
        port: Number(process.env.PORT) || 3333,
    },
    build: {
        outDir: path.resolve(__dirname, '..', 'public'),
    }
})