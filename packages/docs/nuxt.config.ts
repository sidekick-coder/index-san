import path from 'path'

const appPath = path.resolve(__dirname, '..', 'app')

export default defineNuxtConfig({
    extends: '@nuxt-themes/docus',
    modules: ['@nuxtjs/tailwindcss'],
    content: {
        locales: ['en-US', 'pt-BR'],
        defaultLocale: 'en-US',
    },
    components: {
        dirs: [
            '~/components',
            {
                path: path.resolve(appPath, 'components'),
                global: true,
                ignore: ['*.spec.ts'],
            },
        ],
    },
    alias: {
        '@core': path.resolve(__dirname, '..', 'core'),
        // app
        '@components': path.resolve(appPath, 'components'),
        '@composables': path.resolve(appPath, 'composables'),
        '@plugins': path.resolve(appPath, 'plugins'),
        '@modules': path.resolve(appPath, 'modules'),
        '@store': path.resolve(appPath, 'store'),
    },
    tailwindcss: {
        cssPath: path.resolve(__dirname, '..', 'app', 'assets', 'tailwind.scss'),
        configPath: path.resolve(appPath, 'tailwind.config.js'),
        injectPosition: 'last',
    },
    pinceau: {
        preflight: false,
    },
})
