import path from 'path'
import tailwindcss from 'tailwindcss'

import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

const root = path.resolve(__dirname, '..', '..')

export default defineConfig({
    resolve: {
        alias: {
            // root
            '@core': path.resolve(__dirname, '..', 'core'),
            '@root': root,

            // app
            '@components': path.resolve(__dirname, 'components'),
            '@composables': path.resolve(__dirname, 'composables'),
            '@plugins': path.resolve(__dirname, 'plugins'),
            '@modules': path.resolve(__dirname, 'modules'),
            '@store': path.resolve(__dirname, 'store'),

            // vue bundler
            'vue': path.resolve(root, 'node_modules', 'vue/dist/vue.esm-bundler.js'),
        },
    },
    plugins: [
        vue(),
        AutoImport({
            dts: path.resolve(__dirname, 'auto-import.d.ts'),
            imports: ['vue'],
        }),
        Components({
            dts: path.resolve(__dirname, 'components.d.ts'),
            dirs: ['./components'],
        }),
    ],
    css: {
        postcss: {
            plugins: [
                tailwindcss({
                    config: path.resolve(__dirname, 'tailwind.config.js'),
                }),
            ],
        },
    },
})
