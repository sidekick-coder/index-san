import './styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter } from './router'
import { createVWind } from './plugins/v-wind'
import { createIcon } from './plugins/icons'

import App from './App.vue'
import { createGCRegister } from './plugins/global-component'

const pinia = createPinia()
const router = createRouter()
const vWind = createVWind()
const icon = createIcon()
const register = createGCRegister()

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(vWind)
app.use(icon)
app.use(register)

app.mount('#app')
