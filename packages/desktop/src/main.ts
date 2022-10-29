import './styles/tailwind.scss'
import './styles/main.scss'
import 'highlight.js/scss/base16/dracula.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter } from './router'
import { createVWind } from './plugins/v-wind'
import { createIcon } from './plugins/icons'

import App from './App.vue'
import { createGCRegister } from './plugins/global-component'
import { createHooks } from './plugins/hooks'

const app = createApp(App)

app.use(createRouter())
app.use(createPinia())
app.use(createVWind())
app.use(createIcon())
app.use(createHooks())

app.use(createGCRegister())

app.mount('#app')
