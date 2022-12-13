/**
 * Page meta
 */

import { useState } from '@/composables/state'
import { watch } from 'vue'

interface Meta {
    title: string
}

export function useMeta(payload?: Meta) {
    const meta = useState<Meta>('app:meta', {
        title: 'Index-san',
    })

    if (payload) {
        meta.value.title = payload.title
    }

    watch(
        () => meta.value.title,
        (value) => {
            document.title = value
        }
    )

    return meta
}
