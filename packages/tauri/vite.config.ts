import path from 'path'
import tailwindcss from 'tailwindcss'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { alias } from '../desktop/vite.config'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            ...alias,
            '@client': path.resolve(__dirname, '..', 'desktop'),
        },
    },
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
