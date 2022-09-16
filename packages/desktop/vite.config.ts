import { defineConfig } from 'vitest/config'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'

const root = path.resolve(__dirname, '..', '..')
const rootNodeModules = path.resolve(root, 'node_modules')

export default defineConfig({
    test: {
        watch: false
    },
    resolve: {
        alias: {
            '@' : path.resolve(__dirname, 'src'),
            '@root-node-modules': rootNodeModules,
            'vue': path.resolve(rootNodeModules, 'vue/dist/vue.esm-bundler.js'),
        }
    },
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
