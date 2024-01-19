interface OptionFunction {
    (value: any): { styles?: any; classes?: any }
}

interface OptionSpecialMethods {
    _shared?: string | OptionFunction
    _empty?: string | OptionFunction
}

interface Options {
    [key: string]: string | OptionFunction
}

export function useVariant<P extends object, K extends keyof P>(
    props: P,
    key: K,
    variationOptions: Options & OptionSpecialMethods = {}
) {
    const options = ref(variationOptions)

    function setOptions(variationOptions: Options & OptionSpecialMethods) {
        options.value = variationOptions
    }

    function getVariant(name: string) {
        const option = options.value[name]

        const result = {
            classes: '',
            styles: '',
        }

        if (!option) return null

        if (typeof option === 'string') {
            result.classes = option
        }

        if (typeof option === 'function') {
            Object.assign(result, option(props[key]))
        }

        return result
    }

    const classes = computed(() => {
        const result: string[] = []

        const variant = getVariant(props[key] as string)
        const shared = getVariant('_shared')
        const empty = getVariant('_empty')

        if (shared) {
            result.push(shared.classes)
        }

        if (variant) {
            result.push(variant.classes)
        }

        if (!variant && empty) {
            result.push(empty.classes)
        }

        return result.join(' ')
    })

    const styles = computed(() => {
        const result: string[] = []

        const variant = getVariant(props[key] as string)
        const shared = getVariant('_shared')
        const empty = getVariant('_empty')

        if (shared) {
            result.push(shared.styles)
        }

        if (variant) {
            result.push(variant.styles)
        }

        if (!variant && empty) {
            result.push(empty.styles)
        }

        return result.join(' ')
    })

    return reactive({
        classes: classes,
        styles: styles,
        setOptions,
    })
}
