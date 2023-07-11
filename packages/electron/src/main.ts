import type { ClientAppConfig } from '@index-san/app/config'
import { createApp } from '@index-san/app/app'

declare global {
    interface Window {
        electronConfig: ClientAppConfig
    }
}

createApp(window.electronConfig).then(({ app }) => app.mount('#app'))
