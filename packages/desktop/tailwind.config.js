const colors = require('tailwindcss/colors')

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
    theme: {
        colors: {
            'transparent': colors.transparent,

            'b-primary': 'rgb(var(--b-primary))',
            'b-secondary': 'rgb(var(--b-secondary))',

            't-primary': 'rgb(var(--t-primary))',
            't-secondary': 'rgb(var(--t-secondary))',

            'lines': 'rgb(var(--lines))',

            'accent': 'rgb(var(--accent) / 1)',
            'danger': 'rgb(var(--danger))',
            'info': 'rgb(var(--info))',
        },
    },
    plugins: [],
}
