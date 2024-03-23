import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/welcome',
        component: () => import('./pages/WWelcome.vue'),
    })
}
