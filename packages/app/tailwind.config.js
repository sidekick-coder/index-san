const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    theme: {
        fontFamily: {
            roboto: ['Roboto', 'sans-serif'],
        },
    },
    plugins: [
        plugin(function ({ addVariant }) {
            addVariant('hover-and-clickable', '&:hover.cursor-pointer',)
        })
    ],
}
