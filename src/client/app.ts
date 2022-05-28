import { createApp } from 'vue'
import { orderBy } from 'lodash'

import App from './app.vue'
import createRouter from './router'

const app = createApp(App)
const router = createRouter()

app.use(router)

const plugins = import.meta.globEager('./plugins/*.ts')

orderBy(Object.values(plugins), 'priority')
  .map((p) => p.default)
  .forEach((plugin) => plugin({ app }))

app.mount('#app')
