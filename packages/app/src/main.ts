import './assets/tailwind.scss'
import './assets/main.scss'

import { createApp as createVueApp, type App as VueApp } from 'vue'
import App from './App.vue'
import router from '@/router/router'


interface Plugin {
    name?: string
    order?: number
    setup?: (app: VueApp) => Promise<void> | void
}

async function createApp() {
    const app = createVueApp(App)

    app.use(router)

    const files = import.meta.glob<Record<string, Plugin>>('./plugins/*.ts', { eager: true })
    
    const plugins: Plugin[] = Object.entries(files).filter(([, p]) => !!p.default).map(([name, p]) => ({
        name: name.replace('./plugins/', ''),
        order: 999,
        ...p.default,
    }))

    plugins.sort((a, b) => a.order! - b.order!)

    for await (const plugin of plugins) {
        console.debug(`[app] plugin ${plugin.name} loaded`)

        if (plugin.setup) {
            await plugin.setup(app)
        }
    }

    return app
}

createApp().then((app) => {
    app.mount('#app')
})

