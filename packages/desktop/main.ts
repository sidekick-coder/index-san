import './assets/tailwind.scss'
import './assets/main.scss'
import 'highlight.js/scss/base16/dracula.scss'

import { App as VueApp, createApp as baseCreateApp } from 'vue'

import App from './App.vue'

interface Plugin {
    default?: (app: VueApp) => void
    order?: number
}

async function createApp() {
    const app = baseCreateApp(App)

    const plugins = import.meta.glob<Record<string, Plugin>>('./plugins/*.ts', { eager: true })

    Object.values(plugins)
        .filter((p) => !!p.default)
        .sort((a: Plugin, b: Plugin) => (a.order || 99) - (b.order || 99))
        .forEach((plugin: Plugin) => plugin.default!(app))

    return { app }
}

createApp().then(({ app }) => app.mount('#app'))
