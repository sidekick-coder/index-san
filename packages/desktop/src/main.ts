import { createApp } from 'vue'
import createRouter from './router'

import './styles/main.css'

import App from './App.vue'

const app = createApp(App)
const router = createRouter()

app.use(router)

app.mount('#app')
