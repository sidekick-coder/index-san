const path = require('path')
const tailwindcss = require('tailwindcss')

const { defineConfig } = require('vite')

const vue = require('@vitejs/plugin-vue')
const Components = require('unplugin-vue-components/vite')
const AutoImport = require('unplugin-auto-import/vite')
const DefineProp = require('@vue-macros/define-prop/vite')

const root = path.resolve(__dirname, '..', '..')

module.exports = defineConfig({
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
        vue({
            script: {
                defineModel: true,
            },
        }),
        DefineProp(),
        AutoImport({
            dts: path.resolve(__dirname, 'auto-import.d.ts'),
            imports: ['vue'],
        }),
        Components({
            dts: path.resolve(__dirname, 'components.d.ts'),
            dirs: [path.resolve(__dirname, 'components')],
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
