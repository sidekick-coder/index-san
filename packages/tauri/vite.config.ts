import path from 'path'
import tailwindcss from 'tailwindcss'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { alias } from '../app/vite.config'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            ...alias,
            '@client': path.resolve(__dirname, '..', 'app'),
        },
    },
    css: {
        postcss: {
            plugins: [
                tailwindcss({
                    config: path.resolve(__dirname, '..', 'app', 'tailwind.config.js'),
                }),
            ],
        },
    },
})
