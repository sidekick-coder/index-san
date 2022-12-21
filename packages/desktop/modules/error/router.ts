import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/:pathMatch(.*)*',
        name: 'error',
        component: () => import('@/modules/workspace/WLayout.vue'),
        children: [
            {
                path: '',
                name: '404',
                component: () => import('./pages/404.vue'),
            },
        ],
    })
}
