const register = ref(new Map<string, any>());

export function useState(key: string, defaultValue: any) {
    if (!register.value.has(key)) {
        register.value.set(key, defaultValue)
    }

    return computed({
        get: () => register.value.get(key),
        set: (value) => register.value.set(key, value)
    })
}
