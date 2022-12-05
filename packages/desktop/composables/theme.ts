import colors from 'tailwindcss/colors'
import { useState } from './state'

const defaultTheme = {
    colors: {
        'b-primary': '24 24 27',
        'b-secondary': '39 39 42',
        'lines': '55 65 81',

        't-primary': '255 255 255',
        't-secondary': '107 114 128',

        'accent': '20 184 166',
        'info': '59 130 246',
        'warn': '250 204 21',
        'danger': '239 68 68',
    },
}

export function useTheme() {
    const theme = useState('app:theme', defaultTheme, {
        localStorage: true,
    })

    function get() {
        return theme.value || defaultTheme
    }

    function set(value: typeof defaultTheme) {
        theme.value = value
    }

    function load() {
        const { colors } = get()

        Object.keys(colors).forEach((key) => {
            document.documentElement.style.setProperty(`--${key}`, colors[key])
        })
    }

    function chartColors() {
        return [
            colors.amber[500],
            colors.blue[500],
            colors.cyan[500],
            colors.emerald[500],
            colors.fuchsia[500],
            colors.green[500],
            colors.indigo[500],
            colors.lime[500],
            colors.orange[500],
            colors.pink[500],
            colors.purple[500],
            colors.red[500],
            colors.rose[500],
            colors.sky[500],
            colors.teal[500],
            colors.violet[500],
            colors.yellow[500],
        ]
    }

    return {
        get,
        set,
        load,
        chartColors,
    }
}
