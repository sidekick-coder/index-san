import './assets/tailwind.scss'
import './assets/main.scss'

import { createApp as createVueApp } from 'vue'
import type { Plugin } from '@/composables/definePlugin'
import App from './App.vue'
import router from '@/router/router'

import { vVisible } from './directives/vVisible'

async function createApp() {
    const app = createVueApp(App)

    app.use(router)

    app.directive('visible', vVisible)

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

