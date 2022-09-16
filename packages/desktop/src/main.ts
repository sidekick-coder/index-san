import { createApp } from 'vue'
import { createPinia } from 'pinia'
import createRouter from './router'
import { createVWind } from './plugins/v-wind'

import './styles/main.css'

import App from './App.vue'

const pinia = createPinia()
const router = createRouter()
const vWind = createVWind()

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(vWind)

app.mount('#app')
