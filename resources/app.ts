import { createApp } from 'vue'
import App from './views/index.vue'
import gc from './plugins/gc'
import pinia from './plugins/pinia'
import vWind from './plugins/vue-wind'

import './styles/index.css'

const app = createApp(App)

gc({ app })
vWind({ app })
pinia({ app })

app.mount('#app')

