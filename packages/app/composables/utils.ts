import type { Ref } from 'vue'
export function isJSON(source: string) {
    try {
        JSON.parse(source)
        return true
    } catch (error) {
        return false
    }
}

export function useNonReactive<T extends Array<any> | Object>(source: T) {
    return JSON.parse(JSON.stringify(source)) as T
}

export function waitFor(cb: () => boolean, timeout = 500) {
    return new Promise<void>((resolve, reject) => {
        const start = Date.now()

        const interval = setInterval(() => {
            if (cb()) {
                resolve()
                clearInterval(interval)
            }

            if (Date.now() > start + timeout) {
                reject(new Error('[wait-for] timeout'))
                clearInterval(interval)
            }
        }, 50)
    })
}

export function toCssMeasurement(value: string | number) {
    if (typeof value === 'number') {
        return `${value}px`
    }

    if (/(%|px|deg)/.test(value)) {
        return value
    }

    if (/[0-9]/.test(value)) {
        return `${value}px`
    }

    return value
}

export function findCircularItem<T extends Array<any>>(array: T, index: number) {
    const length = array.length

    const moveIndex = ((index % length) + length) % length

    return array[moveIndex]
}

export function useDefinedRef<T>(...arg1: Ref<T>[]) {
    const defined = arg1.find((item) => item.value !== null && item.value !== undefined)

    return computed<T>({
        get() {
            return defined!.value
        },
        set(value) {
            if (!defined) return

            defined.value = value
        },
    })
}

export function inspect(value: any) {
    let result = value

    if (typeof result === 'function') {
        result = value.toString()
    }

    if (typeof result === 'object') {
        result = JSON.stringify(result, null, 4)
    }

    return result
}
