import { definePlugin } from '@/composables/define-plugin'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas, far)

export default definePlugin(({ app }) => {
  app.component('FaIcon', FontAwesomeIcon)
})
