import { createApp } from 'vue'
import { orderBy } from 'lodash'

import './styles/index.css'

import App from './app.vue'

const app = createApp(App)

const plugins = import.meta.globEager('./plugins/*.ts')

orderBy(Object.values(plugins), 'priority')
  .map((p) => p.default)
  .forEach((plugin) => plugin({ app }))

app.mount('#app')
