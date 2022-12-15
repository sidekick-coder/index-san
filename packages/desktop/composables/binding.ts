export function createBindings<K extends string>(attrs: Record<string, any>, bindings: K[]) {
    const root = {}
    const result: any = {}

    bindings.forEach((b) => {
        result[b] = {}
    })

    Object.keys(attrs).forEach((key) => {
        const bind = bindings.find((b) => key.startsWith(`${b}:`))

        if (bind) {
            result[bind][key.replace(`${bind}:`, '')] = attrs[key]
            return
        }

        root[key] = attrs[key]
    })

    result['root'] = root

    return result as Record<K | 'root', any>
}
