import { useState } from '@/composables/state'

export function useToggleDrawer() {
    return useState('app:drawer', true, { localStorage: true })
}
