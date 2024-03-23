import { computed, ref } from 'vue'

interface Options {
    localStorage?: boolean
}

const states = ref(new Map<string, any>())

function isJSON(value: string) {
    try {
        JSON.parse(value)
        return true
    } catch {
        return false
    }
}

function setLocalStorage(key: string, payload: any) {
    let value = payload

    if (['object', 'array'].includes(typeof value)) {
        value = JSON.stringify(value)
    }

    if (['boolean'].includes(typeof value)) {
        value = value ? 'true' : 'false'
    }

    localStorage.setItem(key, value)
}

function getLocalStorage<T = any>(key: string, defaultValue?: any) {
    let value: any = localStorage.getItem(key)

    if (value === null) {
        return defaultValue
    }

    if (['true', 'false'].includes(value)) {
        value = value === 'true'
    }

    if (isJSON(value)) {
        value = JSON.parse(value)
    }

    return value as T
}

export function useState<T = any>(key: string, defaultValue?: T, options?: Options) {
    if (options?.localStorage && !states.value.has(key)) {
        states.value.set(key, getLocalStorage(key, defaultValue))
    }

    if (!states.value.has(key)) {
        states.value.set(key, defaultValue)
    }

    return computed<T>({
        get() {
            return states.value.get(key) as T
        },
        set(v) {
            if (options?.localStorage) {
                setLocalStorage(key, v)
            }

            states.value.set(key, v)
        },
    })
}

export function useStateV2<T = any>(defaultValue?: T) {
    const key = ref('')

    const state = computed<T>({
        get() {
            return states.value.get(key.value) || defaultValue
        },
        set(value) {
            states.value.set(key.value, value)
        },
    })

    function setKey(value: string) {
        key.value = value
    }

    return [state, setKey] as [typeof state, typeof setKey]
}
