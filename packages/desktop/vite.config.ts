import { defineConfig, configDefaults } from 'vitest/config'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'

const root = path.resolve(__dirname, '..', '..')
const rootNodeModules = path.resolve(root, 'node_modules')

const alias = {
    '@core': path.resolve(__dirname, '..', 'core'),
    '@root-node-modules': rootNodeModules,
    '@': path.resolve(__dirname, 'src'),
    'vue': path.resolve(rootNodeModules, 'vue/dist/vue.esm-bundler.js'),
}

export default defineConfig({
    test: {
        watch: false,
        exclude: [...configDefaults.exclude, 'packages/core/*', 'out'],
    },
    resolve: { alias },
    plugins: [
        vue(),
        electron([
            {
                entry: 'electron/main.ts',
                vite: {
                    resolve: { alias },
                },
            },
            {
                entry: 'electron/preload.ts',
                onstart(options) {
                    options.reload()
                },
            },
        ]),
    ],
})
