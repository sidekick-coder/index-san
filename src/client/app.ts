import * as Vue from 'vue'
import { orderBy } from 'lodash'

import App from './app.vue'
import createRouter from './router'

const app = Vue.createApp(App)
const router = createRouter()

app.use(router)

window.vue = Vue

const plugins = import.meta.globEager('./plugins/*.ts')

orderBy(Object.values(plugins), 'priority')
  .map((p) => p.default)
  .forEach((plugin) => plugin({ app }))

app.mount('#app')
