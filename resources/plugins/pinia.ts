import { definePlugin } from '@/composables/define-plugin'
import { createPinia } from 'pinia'

export const priority = 1

export default definePlugin(({ app }) => {
  app.use(createPinia())
})
