import { createRouter as baseCreateRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'

export function createRouter() {
    return baseCreateRouter({
        history: createWebHashHistory(),
        routes,
    })
}
