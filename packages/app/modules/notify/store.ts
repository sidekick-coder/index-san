import uuid from 'uuid-random'

import { defineStore } from 'pinia'

import { defaultTheme } from '@modules/option/composables/theme'
import { ref } from 'vue'

interface Message {
    id: string
    content: string
    color: keyof typeof defaultTheme.colors
    timeout?: number
}

export const useStore = defineStore('notify', () => {
    const messages = ref<Message[]>([])

    function remove(id: string) {
        messages.value = messages.value.filter((m) => m.id !== id)
    }

    function notify(message: Omit<Message, 'id'>) {
        const id = uuid()

        messages.value.push({
            ...message,
            id,
        })

        setTimeout(() => remove(id), message.timeout || 3000)
    }

    function error(content: string) {
        notify({
            content,
            color: 'danger',
        })
    }

    return {
        messages,

        notify,
        error,
    }
})
