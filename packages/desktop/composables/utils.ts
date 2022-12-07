export function isJSON(source: string) {
    try {
        JSON.parse(source)
        return true
    } catch (error) {
        return false
    }
}
