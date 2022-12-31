import type { ClientAppConfig } from '@client/config'
import { createApp } from '@client/app'

declare global {
    interface Window {
        electronConfig: ClientAppConfig
    }
}

createApp(window.electronConfig).then(({ app }) => app.mount('#app'))
