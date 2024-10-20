interface QuickDialogOptions {
    title: string
    message?: string
    type?: 'success' | 'error' | 'warning' | 'info'
    icon?: string
    hideCancel?: boolean
    hideOk?: boolean
    okText?: string
    cancelText?: string
    buttons?: any[]
}

interface QuickDialog extends QuickDialogOptions {
    id: number
    onOk: () => void
    onCancel: () => void
}

const dialogItems = ref<QuickDialog[]>([])
const lastId = ref(0)

export function useQuickDialog() {
    function close(id: number) {
        const index = dialogItems.value.findIndex((dialog) => dialog.id === id)

        if (index === -1) {
            return
        }

        dialogItems.value.splice(index, 1)
    }

    function open(options: QuickDialogOptions) {
        return new Promise((resolve) => {
            const id = lastId.value++

            function end(value: boolean) {
                close(id)
                resolve(value)
            }

            const dialog = {
                ...options,
                id,
                onOk: () => end(true),
                onCancel: () => end(false),
            }

            dialogItems.value.push(dialog)
        })
    }

    function confirm(payload?: Partial<QuickDialogOptions>) {
        const title = 'Are you sure?' 
        const message = 'This action can not be undone' 

        return open({
            title,
            message,
            ...payload,
        })
    }

    function info(title: string, message: string) {
        return open({
            type: 'info',
            title,
            message,
            hideCancel: true,
        })
    }

    return reactive({
        dialogItems,
        open,
        close,
        confirm,
        info,
    })
}

export const $dialog = useQuickDialog()
