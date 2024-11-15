import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import DefineProp from '@vue-macros/define-prop/vite'
import DefineEmit from '@vue-macros/define-emit/vite'

export default defineConfig({
    optimizeDeps: {
        exclude: ['hephaestus']
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'vue': fileURLToPath(new URL('../../node_modules/vue/dist/vue.esm-bundler.js', import.meta.url)),
        },
    },
    plugins: [
        vue({ script: { defineModel: true } }),       
        DefineProp(),
		DefineEmit(),
        AutoImport({
            dts: 'runtime/auto-imports.d.ts',
            dirs: [
                'src/components/**/*.{js,ts}',
                'src/composables',
                'src/modules/*/composables',
            ],
            imports: ['vue', 'vue-router', 'vue-i18n', '@vueuse/core', {
					from: '@vueuse/router',
					imports: ['useRouteQuery']
			}],
			vueTemplate: true,
        }),
        Components({
            dts: 'runtime/components.d.ts',
            dirs: ['src/components/**/*.vue', 'src/modules/*/components'],
        }),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
                'favicon.ico',
                'pwa/logo-180.png',
                'pwa/logo-180.svg',
                'pwa/screenshot-01.png'
            ],
            devOptions: {
                // enabled: true,
            },
            manifest: {
                name: 'Index-san',
                short_name: 'IndexSan',
                description: 'Notes app + Filesystem API for modern web',
                theme_color: '#ffffff',                
                icons: [
                  {
                    src: 'pwa/logo-180.png',
                    sizes: '180x180',
                    type: 'image/png'
                  },
                ],
                screenshots: [
                    {
                        src: 'pwa/screenshot-01.png',
                        sizes: '1280x720',
                        type: 'image/png',
                        form_factor: 'narrow',
                    },
                    {
                        src: 'pwa/screenshot-01.png',
                        sizes: '1280x720',
                        type: 'image/png',
                        form_factor: 'wide',
                    },
                ],
              } 
        }),
    ],
})
