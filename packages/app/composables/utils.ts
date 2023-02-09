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
