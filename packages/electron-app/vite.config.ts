import path from 'path'

import { defineConfig, mergeConfig } from 'vite'
import electron from 'vite-plugin-electron'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import viteConfig from '../desktop/vite.config'

const alias = {
    '@core': path.resolve(__dirname, '..', 'core'),
    '@client': path.resolve(__dirname, '..', 'desktop'),
}

export default mergeConfig(
    viteConfig,
    defineConfig({
        resolve: { alias },
        plugins: [
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
    })
)
