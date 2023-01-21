import { mergeConfig } from 'vite'
import { defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            watch: false,
            environment: 'jsdom',
            exclude: [...configDefaults.exclude, 'packages/core/*'],
            setupFiles: ['__tests__/setup.ts'],
        },
    })
)
