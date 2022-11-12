import moment from 'moment'
import { App } from 'vue'

export function createMoment(){
    function install(app: App){
        app.config.globalProperties.$moment = moment
    }

    return { install }
}