interface Callback {
    (name: string, params: string, body: string): string
}

export function defineFunctionProcessor(cb: Callback) {
    return (code: string) => {
        const regex = /function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*\{([\s\S]*?)\}/g

        const matched = code.matchAll(regex)

        if (!matched) return code

        return Array.from(matched).reduce((result, match) => {
            const [fullMatch, name, params, body] = match

            return result.replace(fullMatch, cb(name, params, body))
        }, code)
    }
}
