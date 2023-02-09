import { open } from '@tauri-apps/api/shell'
import { createApp } from '@client/app'
import TauriApp from './services/app'

createApp({
    useCase: TauriApp.useCase.bind(TauriApp),
    open: {
        url: open,
    },
}).then(({ app }) => app.mount('#app'))
