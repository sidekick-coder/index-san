export function useMeasurement() {
    function toSize(value?: string | Number) {
        if (!value) return undefined

        if (/^\d+$/.test(String(value))) {
            return `${value}px`
        }

        return String(value)
    }

    return { toSize }
}
