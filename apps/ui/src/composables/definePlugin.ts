import type { App } from 'vue'

export interface Plugin {
    name?: string
    order?: number
    setup?: (app: App) => Promise<void> | void
}

export function definePlugin(payload: Plugin) {
    return payload
}