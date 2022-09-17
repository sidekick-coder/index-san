import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolder, faFile, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { App } from 'vue'

library.add(faFolder, faFile, faTrash)

export function createIcon(){
    function install(app: App){
        app.component('fa-icon', FontAwesomeIcon)
    }

    return { install }
}