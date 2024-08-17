export interface SnackbarOptions {
    title: string
    message?: string
    timeout?: number
    color?: 'primary' | 'success' | 'zinc' | 'accent' | 'danger'
}

export interface SnackbarItem extends SnackbarOptions {
    id: number
}

const items = ref<SnackbarItem[]>([])
const lastId = ref(0)

export function useQuickSnackbar() {
    function remove(index: number) {
        const itemIndex = items.value.findIndex((item) => item.id === index)

        if (itemIndex === -1) {
            return
        }

        items.value.splice(itemIndex, 1)
    }

    function show(options: SnackbarOptions) {
        const timeout = options.timeout || 5000

        const item: SnackbarItem = {
            ...options,
            id: lastId.value++,
        }

        items.value.push(item)

        setTimeout(() => remove(item.id), timeout)
    }

    function error(message: string) {
        show({ title: message, color: 'danger' })
    }

    function success(message: string) {
        show({ title: message, color: 'success' })
    }

    return reactive({
        items,
        show,
        error,
        remove,
        success,
    })
}

export const $snackbar = useQuickSnackbar()
