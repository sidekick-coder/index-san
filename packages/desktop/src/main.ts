import './assets/tailwind.scss'
import './assets/main.scss'
import 'highlight.js/scss/base16/dracula.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import { createGCRegister } from './plugins/global-component'
import { createHooks } from './plugins/hooks'
import { createMoment } from './plugins/moment'
import { createI18n } from './plugins/i18n'
import { createRouter } from './router'
import { createVWind } from './plugins/v-wind'
import { createIcon } from './plugins/icons'

const app = createApp(App)

app.use(createI18n())
app.use(createRouter())
app.use(createPinia())
app.use(createVWind())
app.use(createIcon())
app.use(createHooks())
app.use(createMoment())

app.use(createGCRegister())

app.mount('#app')
