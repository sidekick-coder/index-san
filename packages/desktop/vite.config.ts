import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'

console.log(electron)

export default defineConfig({
    plugins: [
        vue(), 
        electron({
            main: {
                entry: 'electron/main.ts',
            },
        }),
    ]
})
