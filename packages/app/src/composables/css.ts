class CSSHelper {
    public isColor(value: string) {
        const options = ['#', 'rgb', 'rgba', 'hsl']

        return options.some((o) => value && value.startsWith(o))
    }

    public isUnit(value: string) {
        return /(px|em|rem|deg|%)/.test(value)
    }

    public toMeasurement(value: number | string) {
        if (typeof value === 'number') {
            return `${value}px`
        }

        if (this.isUnit(value)) {
            return value
        }

        if (/[0-9]/.test(value)) {
            return `${value}px`
        }

        return value
    }
}

export const css = new CSSHelper()

export function useCss() {
    return css
}
