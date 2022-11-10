import { defineConfig } from 'vitest/config'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'

const root = path.resolve(__dirname, '..', '..')
const rootNodeModules = path.resolve(root, 'node_modules')

console.log(path.resolve(root, 'packages', 'core'))

const alias = {
    '@core' : path.resolve(__dirname, '..', 'core'),
    '@root-node-modules': rootNodeModules,
    '@' : path.resolve(__dirname, 'src'),
    'vue': path.resolve(rootNodeModules, 'vue/dist/vue.esm-bundler.js'),
}

export default defineConfig({
    test: {
        watch: false
    },
    resolve: { alias },
    plugins: [
        vue(), 
        electron([
            {
                entry: 'electron/main.ts',
                vite: {
                    resolve: { alias },
                }
            },
            {
                entry: 'electron/preload.ts',
                onstart(options) {
                    options.reload()
                },
            }
        ]),
    ]
})
