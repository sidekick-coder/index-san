import { createPinia } from 'pinia'

export default ({ app }) => {
  app.use(createPinia())
}
