import { createApp } from 'vue'
import { createPinia } from 'pinia'
import createRouter from './router'

import './styles/main.css'

import App from './App.vue'

const pinia = createPinia()
const router = createRouter()

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
