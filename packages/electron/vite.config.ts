import { mergeConfig } from 'vite'
import electron from 'vite-plugin-electron'

// eslint-disable-next-line
// @ts-ignore
import baseConfig from '@index-san/app/vite.base.config'

export default mergeConfig(baseConfig, {
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
