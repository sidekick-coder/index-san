import { Router } from 'vue-router'

export const order = 1

export default (router: Router) => {
    router.addRoute({
        path: '/',
        name: 'main',
        component: () => import('./WLayout.vue'),
    })

    router.addRoute('main', {
        path: 'workspaces',
        component: () => import('./pages/WList.vue'),
    })
}
