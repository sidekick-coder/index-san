import './assets/tailwind.scss'
import './assets/main.scss'
import 'highlight.js/scss/base16/dracula.scss'

import { createApp as baseCreateApp } from 'vue'
import App from './App.vue'

import type { App as VueApp } from 'vue'
import type { ClientAppConfig } from './config'

interface Plugin {
    default?: (app: VueApp) => void
    order?: number
}

window.clientConfig = {
    useCase: () => Promise.reject('Not implemented'),
    open: {
        url: () => Promise.reject('Not implemented'),
        directory: () => Promise.reject('Not implemented'),
    },
}

export async function createApp(config: ClientAppConfig) {
    const app = baseCreateApp(App)

    app.config.compilerOptions.whitespace = 'preserve'

    window.clientConfig = config

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
