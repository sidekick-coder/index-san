import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/:pathMatch(.*)*',
        name: 'error',
        component: () => import('@/modules/workspace/WLayout.vue'),
        children: [
            {
                path: '',
                component: () => import('./views/404.vue'),
            },
        ],
    })
}
