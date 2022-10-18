/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',    
        './src/**/*.{ts,vue,scss}',
        '../../node_modules/vue-wind/composables/**/*.ts',
        '../../node_modules/vue-wind/components/**/*.{ts,vue}',
    ],
    theme: {},
    plugins: [],
}
