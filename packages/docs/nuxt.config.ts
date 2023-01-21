import path from 'path'

const desktopPath = path.resolve(__dirname, '..', 'desktop')

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
                path: path.resolve(desktopPath, 'components'),
                global: true,
            },
        ],
    },
    alias: {
        '@core': path.resolve(__dirname, '..', 'core'),
        // app
        '@components': path.resolve(desktopPath, 'components'),
        '@composables': path.resolve(desktopPath, 'composables'),
        '@plugins': path.resolve(desktopPath, 'plugins'),
        '@modules': path.resolve(desktopPath, 'modules'),
        '@store': path.resolve(desktopPath, 'store'),
    },
    tailwindcss: {
        cssPath: path.resolve(__dirname, '..', 'desktop', 'assets', 'tailwind.scss'),
        configPath: path.resolve(desktopPath, 'tailwind.config.js'),
        injectPosition: 'last',
    },
    pinceau: {
        preflight: false,
    },
})
