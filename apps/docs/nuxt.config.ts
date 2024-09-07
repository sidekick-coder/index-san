export default defineNuxtConfig({
    extends: ['@nuxt-themes/docus'],
    devtools: { enabled: true },
    modules: ['@nuxtjs/tailwindcss'],
    compatibilityDate: '2024-08-24',
    css: ['~/assets/main.css'],
    runtimeConfig: {
        public: {
            isAppUrl: '',
        },
    },
})

