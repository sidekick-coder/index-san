class CSSHelper {
    public isColor(value: string) {
        const options = ['#', 'rgb', 'rgba', 'hsl']

        return options.some((o) => value.startsWith(o))
    }
}

export const css = new CSSHelper()

export function useCss() {
    return css
}
