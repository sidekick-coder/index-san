import { defineConfig } from 'vite'
import path from 'path'


export default defineConfig({
    server: {
        open: false, // do not open the browser as we use electron
        port: Number(process.env.PORT) || 3333,
    },
    root: path.resolve( __dirname, 'src'),
    build: {
        outDir: path.resolve(__dirname, 'dist')
    }
})