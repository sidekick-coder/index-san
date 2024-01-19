import uuid from 'uuid-random'

interface DialogItem {
    id: string
    title: string
    show: boolean
    message?: string
    result?: any
}

export const dialogItems = [] as DialogItem[]

export default function useQuickDialog() {
    function mount(args: Pick<DialogItem, 'title' | 'message'>) {
        const id = uuid()

        return {
            id,
            show: false,
            ...args,
        } as DialogItem
    }

    function open(args: Pick<DialogItem, 'title' | 'message'>) {
        const item = mount(args)

        return new Promise<any>((resolve) => {
            dialogItems.push(item)

            const interval = setInterval(() => {
                if (!item.show) return

                clearInterval(interval)

                resolve(item.result)
            }, 100)
        })
    }

    function close(id: string) {
        const item = dialogItems.find((i) => i.id === id)

        if (!item) return

        item.show = false
    }

    return {
        open,
        close,
        dialogItems,
    }
}
