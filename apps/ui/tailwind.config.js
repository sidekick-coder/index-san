const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
        '../../packages/hephaestus/**/*.{vue,js,ts,jsx,tsx}',
    ],
    theme: {
        fontFamily: {
            roboto: ['Roboto', 'sans-serif'],
            lato: ['Lato', 'sans-serif'],
            railway: ['Railway', 'sans-serif'],
        },
        extend: {
            colors: {
                primary:{
                    50: 'rgb(var(--color-primary-50) / <alpha-value>)',
                    100: 'rgb(var(--color-primary-100) / <alpha-value>)',
                    200: 'rgb(var(--color-primary-200) / <alpha-value>)',
                    300: 'rgb(var(--color-primary-300) / <alpha-value>)',
                    400: 'rgb(var(--color-primary-400) / <alpha-value>)',
                    500: 'rgb(var(--color-primary-500) / <alpha-value>)',
                    600: 'rgb(var(--color-primary-600) / <alpha-value>)',
                    800: 'rgb(var(--color-primary-800) / <alpha-value>)',
                    900: 'rgb(var(--color-primary-900) / <alpha-value>)',
                    700: 'rgb(var(--color-primary-700) / <alpha-value>)',
                },
                secondary:{
                    50: 'rgb(var(--color-secondary-50) / <alpha-value>)',
                    100: 'rgb(var(--color-secondary-100) / <alpha-value>)',
                    200: 'rgb(var(--color-secondary-200) / <alpha-value>)',
                    300: 'rgb(var(--color-secondary-300) / <alpha-value>)',
                    400: 'rgb(var(--color-secondary-400) / <alpha-value>)',
                    500: 'rgb(var(--color-secondary-500) / <alpha-value>)',
                    600: 'rgb(var(--color-secondary-600) / <alpha-value>)',
                    700: 'rgb(var(--color-secondary-700) / <alpha-value>)',
                    800: 'rgb(var(--color-secondary-800) / <alpha-value>)',
                    900: 'rgb(var(--color-secondary-900) / <alpha-value>)',
                },
                body:{
                    0: 'rgb(var(--color-body-0) / <alpha-value>)',
                    10: 'rgb(var(--color-body-10) / <alpha-value>)',
                    20: 'rgb(var(--color-body-20) / <alpha-value>)',
                    30: 'rgb(var(--color-body-30) / <alpha-value>)',
                    40: 'rgb(var(--color-body-40) / <alpha-value>)',
                    50: 'rgb(var(--color-body-50) / <alpha-value>)',
                    60: 'rgb(var(--color-body-60) / <alpha-value>)',
                    70: 'rgb(var(--color-body-70) / <alpha-value>)',
                    80: 'rgb(var(--color-body-80) / <alpha-value>)',
                    90: 'rgb(var(--color-body-90) / <alpha-value>)',
                    100: 'rgb(var(--color-body-100) / <alpha-value>)',
                    200: 'rgb(var(--color-body-200) / <alpha-value>)',
                    300: 'rgb(var(--color-body-300) / <alpha-value>)',
                    400: 'rgb(var(--color-body-400) / <alpha-value>)',
                    500: 'rgb(var(--color-body-500) / <alpha-value>)',
                    600: 'rgb(var(--color-body-600) / <alpha-value>)',
                    700: 'rgb(var(--color-body-700) / <alpha-value>)',
                    800: 'rgb(var(--color-body-800) / <alpha-value>)',
                    900: 'rgb(var(--color-body-900) / <alpha-value>)',
                }
            }
        }
    },
    plugins: [
        plugin(function ({ addVariant }) {
            addVariant('hover-and-clickable', '&:hover.cursor-pointer',)
        })
    ],
}
