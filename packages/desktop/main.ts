import './src/assets/tailwind.scss'
import './src/assets/main.scss'
// import 'highlight.js/scss/base16/dracula.scss'

import { App as VueApp, createApp as baseCreateApp } from 'vue'

import App from './src/App.vue'

// import { createGCRegister } from './plugins/global-component'
// import { createHooks } from './plugins/hooks'
// import { createMoment } from './plugins/moment'
// import { createI18n } from './plugins/i18n'
// import { createRouter } from './src/router'
// import { createVWind } from './plugins/v-wind'
// import { createIcon } from './plugins/icons'

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
        .forEach((plugin: Plugin) => {
            plugin.default!(app)
        })

    return { app }
}

// app.use(createI18n())
// app.use(createRouter())
// app.use(createVWind())
// app.use(createIcon())
// app.use(createHooks())
// app.use(createMoment())

// app.use(createGCRegister())

createApp().then(({ app }) => app.mount('#app'))
