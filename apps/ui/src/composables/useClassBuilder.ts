import { twMerge } from "tailwind-merge"

interface Options {
    class: Ref<any>
}

export function useClassBuilder(options: Options) {
    const map = ref(new Map<string, string>())

    const classes = computed(() => {
        const all = Array.from(map.value.values()).join(' ')

        return twMerge(all, options.class.value)
    })

    function set(key: string, values: string | string[]) {
        map.value.set(key, Array.isArray(values) ? values.join(' ') : values)
    }

    return { map, classes, set }
}
