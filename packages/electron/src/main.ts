import type { ClientAppConfig } from '@is/app/config'
import { createApp } from '@is/app/app'

declare global {
    interface Window {
        electronConfig: ClientAppConfig
    }
}

createApp(window.electronConfig).then(({ app }) => app.mount('#app'))
