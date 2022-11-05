/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',    
        './src/**/*.{ts,vue,scss}',
        '../../node_modules/vue-wind/composables/**/*.ts',
        '../../node_modules/vue-wind/components/**/*.{ts,vue}',
    ],
    safelist: [
        { pattern: /w-*/ },
        { pattern: /h-*/ },
        { pattern: /items-*/ },
        { pattern: /justify-*/ },
    ],
    theme: {},
    plugins: [],
}
