import { defineConfig, mergeConfig } from 'vite'
import electron from 'vite-plugin-electron'

// eslint-disable-next-line
// @ts-ignore
import viteConfig from '@index-san/app/vite.config'

export default mergeConfig(
    viteConfig,
    defineConfig({
        plugins: [
            electron([
                {
                    entry: 'src-electron/main.ts',
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
