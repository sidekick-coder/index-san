import { defineConfig, configDefaults } from 'vitest/config'
import path from 'path'
import vue from '@vitejs/plugin-vue'

const root = path.resolve(__dirname, '..', '..')

export const alias = {
    // root
    '@core': path.resolve(__dirname, '..', 'core'),
    '@root': root,

    // app
    '@': path.resolve(__dirname, '.'),

    // vue bundler
    'vue': path.resolve(root, 'node_modules', 'vue/dist/vue.esm-bundler.js'),
}

export default defineConfig({
    test: {
        watch: false,
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'packages/core/*', 'out'],
        setupFiles: ['__tests__/setup.ts'],
    },
    resolve: { alias },
    plugins: [vue()],
})
