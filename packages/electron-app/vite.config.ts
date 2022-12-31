import path from 'path'

import { defineConfig } from 'vite'
import tailwindcss from 'tailwindcss'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { alias as desktopAlias } from '../desktop/vite.config'

const alias = {
    ...desktopAlias,
    '@client': path.resolve(__dirname, '..', 'desktop'),
}

export default defineConfig({
    resolve: { alias },
    plugins: [
        vue(),
        electron([
            {
                entry: 'src-electron/main.ts',
                vite: {
                    resolve: { alias },
                },
            },
            {
                entry: 'src-electron/preload.ts',
                onstart(options) {
                    options.reload()
                },
            },
        ]),
    ],
    css: {
        postcss: {
            plugins: [
                tailwindcss({
                    config: path.resolve(__dirname, '..', 'desktop', 'tailwind.config.js'),
                }),
            ],
        },
    },
})
