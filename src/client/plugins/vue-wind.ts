import { definePlugin } from '@/composables/define-plugin'
import { useVueWind } from 'vue-wind'

const VWind = useVueWind()

export default definePlugin(({ app }) => {
  app.use(VWind)
})
