import { createPinia } from 'pinia'

export default definePlugin({
    setup(app) {
        app.use(createPinia())
    }
})