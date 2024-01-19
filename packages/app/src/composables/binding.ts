export function useBindings<K extends string>(attrs: Record<string, any>, bindings: K[]) {
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

    function multiple(options: (K | 'root')[]) {
        let multipleResult: any = {}

        options.forEach((option) => {
            multipleResult = {
                ...multipleResult,
                ...result[option],
            }
        })

        return multipleResult
    }

    result.multiple = multiple

    return result as Record<K | 'root', any> & Record<'multiple', typeof multiple>
}

/**
 * @deprecated use useBindings instead
 */
export function createBindings<K extends string>(attrs: Record<string, any>, bindings: K[]) {
    return useBindings(attrs, bindings)
}
