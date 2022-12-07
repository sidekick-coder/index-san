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

    Object.entries(plugins)
        .filter(([, p]) => !!p.default)
        .sort(
            ([, a]: [string, Plugin], [, b]: [string, Plugin]) => (a.order || 99) - (b.order || 99)
        )
        .forEach(([name, plugin]: [string, Plugin]) => {
            console.debug(`[app] plugin ${name.replace('./plugins/', '')} loaded`)
            plugin.default!(app)
        })

    return { app }
}

createApp().then(({ app }) => app.mount('#app'))
