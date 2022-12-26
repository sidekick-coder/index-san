import { defineConfig, configDefaults } from 'vitest/config'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'

const root = path.resolve(__dirname, '..', '..')

const alias = {
    // root
    '@core': path.resolve(__dirname, '..', 'core'),
    '@root': root,

    // app
    '@': path.resolve(__dirname, '.'),

    // vue bundler
    'vue': path.resolve(root, 'node_modules', 'vue/dist/vue.esm-bundler.js'),
}

export default defineConfig({
    test: {
        watch: false,
        environment: 'jsdom',
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
