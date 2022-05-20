import { definePlugin } from '@/composables/define-plugin'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas)

export default definePlugin(({ app }) => {
  app.component('FaIcon', FontAwesomeIcon)
})
