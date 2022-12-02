import { createPinia } from 'pinia'
import { App } from 'vue'

export const order = 1

export default (app: App) => {
    app.use(createPinia())
}
