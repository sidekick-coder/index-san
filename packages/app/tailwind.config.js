const colors = require('tailwindcss/colors')

const path = require('path')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        path.resolve(__dirname, './components/*.vue'),
        path.resolve(__dirname, './modules/**/**/**/*.{ts,vue,scss}'),
        path.resolve(__dirname, '../../node_modules/vue-wind/composables/**/*.ts'),
        path.resolve(__dirname, '../../node_modules/vue-wind/components/**/*.{ts,vue}'),
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
            'b-03': 'rgb(var(--b-03))',

            't-primary': 'rgb(var(--t-primary))',
            't-secondary': 'rgb(var(--t-secondary))',

            'lines': 'rgb(var(--lines))',

            'accent': 'rgb(var(--accent) / 1)',
            'danger': 'rgb(var(--danger))',
            'warn': 'rgb(var(--warn))',
            'info': 'rgb(var(--info))',
        },
        extend: {
            transitionProperty: {
                height: 'height',
                width: 'width',
            },
        },
        data: {
            disabled: 'ui~="disabled"',
        },
        fontFamily: {
            roboto: ['Roboto', 'sans-serif'],
        },
    },
    plugins: [],
}
