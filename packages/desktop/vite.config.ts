import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'

export default defineConfig({
    plugins: [
        vue(), 
        electron({
            main: {
                entry: 'electron/main.ts',
            },
            preload: {
                input: {
                    // Must be use absolute path, this is the restrict of Rollup
                    preload: path.join(__dirname, 'electron/preload.ts'),
                },
            },
        }),
    ]
})
