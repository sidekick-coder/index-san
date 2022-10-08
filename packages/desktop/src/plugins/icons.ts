import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { App } from 'vue'

library.add(fas, far)

export function createIcon(){
    function install(app: App){
        app.component('fa-icon', FontAwesomeIcon)
    }

    return { install }
}