export const defaultTheme = {
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
    function setCSSVariables(theme: Record<string, string> = defaultTheme.colors) {
        Object.entries(theme).forEach(([key, value]) => {
            document.documentElement.style.setProperty(`--${key}`, value)
        })
    }

    return {
        setCSSVariables,
    }
}
