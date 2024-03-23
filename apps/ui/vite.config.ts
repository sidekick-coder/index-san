import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import DefineProp from '@vue-macros/define-prop/vite'

export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'vue': fileURLToPath(new URL('../../node_modules/vue/dist/vue.esm-bundler.js', import.meta.url)),
        },
    },
    plugins: [
        vue({ script: { defineModel: true } }),
        DefineProp(),
        AutoImport({
            dts: 'runtime/auto-imports.d.ts',
            dirs: ['src/composables'],
            imports: ['vue', 'vue-router', 'vue-i18n', '@vueuse/core']
        }),
        Components({
            dts: 'runtime/components.d.ts',
            dirs: ['src/components']
        }),
    ],
})
