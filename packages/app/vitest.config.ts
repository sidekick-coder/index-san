const { mergeConfig } = require('vite')
const { resolve } = require('path')
const { defineConfig, configDefaults } = require('vitest/config')
const viteConfig = require('./vite.config')

const root = resolve(__dirname, '..', '..')

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            watch: false,
            environment: 'jsdom',
            exclude: [...configDefaults.exclude, 'packages/core/*'],
            setupFiles: ['__tests__/setup.ts'],
            reporters: 'verbose',
            alias: [
                {
                    find: /^monaco-editor$/,
                    replacement: resolve(
                        root,
                        'node_modules/monaco-editor/esm/vs/editor/editor.api'
                    ),
                },
            ],
        },
    })
)
