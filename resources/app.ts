import { createApp } from 'vue'
import App from './views/index.vue'
import gc from './plugins/gc'
import vWind from './plugins/vue-wind'

import './styles/index.css'

const app = createApp(App)

gc({ app })
vWind({ app })

app.mount('#app')

