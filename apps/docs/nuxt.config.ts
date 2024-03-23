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
