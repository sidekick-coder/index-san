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
            lato: ['Lato', 'sans-serif'],
            railway: ['Railway', 'sans-serif'],
        },
        extend: {
            colors: {
                primary:{
                    50: 'rgba(255, 251, 234, <alpha-value>)',
                    100: 'rgba(254, 242, 191, <alpha-value>)',
                    200: 'rgba(254, 236, 160, <alpha-value>)',
                    300: 'rgba(254, 228, 116, <alpha-value>)',
                    400: 'rgba(253, 222, 89, <alpha-value>)',
                    500: 'rgba(253, 214, 48, <alpha-value>)',
                    600: 'rgba(230, 195, 44, <alpha-value>)',
                    800: 'rgba(139, 118, 26, <alpha-value>)',
                    900: 'rgba(106, 90, 20, <alpha-value>)',
                    700: 'rgba(180, 152, 34, <alpha-value>)',
                },
                secondary:{
                    50: 'rgba(245, 234, 255, <alpha-value>)',
                    100: 'rgba(225, 191, 254, <alpha-value>)',
                    200: 'rgba(210, 160, 254, <alpha-value>)',
                    300: 'rgba(190, 116, 253, <alpha-value>)',
                    400: 'rgba(177, 89, 253, <alpha-value>)',
                    500: 'rgba(158, 48, 252, <alpha-value>)',
                    600: 'rgba(144, 44, 229, <alpha-value>)',
                    700: 'rgba(112, 34, 179, <alpha-value>)',
                    800: 'rgba(87, 26, 139, <alpha-value>)',
                    900: 'rgba(66, 20, 106, <alpha-value>)',
                },
                body:{
                    0: 'rgba(255, 255, 255, <alpha-value>)',
                    10: 'rgba(250, 250, 250, <alpha-value>)',
                    20: 'rgba(246, 245, 245, <alpha-value>)',
                    30: 'rgba(236, 236, 235, <alpha-value>)',
                    40: 'rgba(224, 224, 222, <alpha-value>)',
                    50: 'rgba(196, 195, 191, <alpha-value>)',
                    60: 'rgba(182, 181, 176, <alpha-value>)',
                    70: 'rgba(170, 169, 163, <alpha-value>)',
                    80: 'rgba(155, 154, 148, <alpha-value>)',
                    90: 'rgba(141, 140, 133, <alpha-value>)',
                    100: 'rgba(127, 125, 117, <alpha-value>)',
                    200: 'rgba(113, 111, 102, <alpha-value>)',
                    300: 'rgba(99, 97, 87, <alpha-value>)',
                    400: 'rgba(87, 85, 74, <alpha-value>)',
                    500: 'rgba(73, 70, 59, <alpha-value>)',
                    600: 'rgba(61, 58, 46, <alpha-value>)',
                    700: 'rgba(44, 41, 28, <alpha-value>)',
                    800: 'rgba(30, 27, 13, <alpha-value>)',
                    900: 'rgba(18, 15, 0, <alpha-value>)',
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
