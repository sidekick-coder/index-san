import { defineStore } from 'pinia'
import uuid from 'uuid-random'

interface DialogParameters {
    title?: string
    message?: string
    timeout?: number
}

interface DialogWithResolves extends DialogParameters {
    id: string
    resolve: (value?: any) => any
    interval: NodeJS.Timer
}

export const useStore = defineStore('dialog', () => {
    const dialogs = ref<DialogWithResolves[]>([])

    function remove(id: string) {
        const index = dialogs.value.findIndex((d) => d.id === id)

        if (index !== -1) {
            dialogs.value.splice(index, 1)
        }
    }

    function createInterval(resolve: DialogWithResolves['resolve'], timeout = 15000) {
        const start = Date.now()

        return setInterval(() => {
            if (Date.now() > start + timeout) {
                return resolve()
            }
        }, 1000)
    }

    function createResolve(resolve: DialogWithResolves['resolve'], id: string) {
        return (value: any) => {
            const dialog = dialogs.value.find((d) => d.id === id)

            if (dialog?.interval) {
                clearInterval(dialog.interval)
            }

            resolve(value)
            remove(id)
        }
    }

    function confirm(payload: DialogParameters): Promise<boolean> {
        const id = uuid()

        return new Promise((resolve) => {
            const dialogResolve = createResolve(resolve, id)

            const dialogInterval = createInterval(dialogResolve)

            dialogs.value.push({
                ...payload,
                id,
                resolve: dialogResolve,
                interval: dialogInterval,
            })
        })
    }

    return {
        dialogs,
        confirm,
    }
})
