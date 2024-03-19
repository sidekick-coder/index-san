import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute('main', {
        path: '/collections',
        name: 'collections',
        component: () => import('./pages/CList.vue'),
    })
}
