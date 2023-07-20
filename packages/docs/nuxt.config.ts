import path from 'path'

const appPath = path.resolve(__dirname, '..', 'app')

export default defineNuxtConfig({
    extends: '@nuxt-themes/docus',
    modules: ['@nuxtjs/tailwindcss'],
    content: {
        locales: ['en-US', 'pt-BR'],
        defaultLocale: 'en-US',
    },
    pinceau: {
        preflight: false,
    },
})
