/**
 * Page meta
 */

import { useState } from '@/composables/state'

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

    return meta
}
