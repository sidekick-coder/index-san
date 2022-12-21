import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/entries',
        component: () => import('./ELayout.vue'),
        children: [
            {
                path: '',
                component: () => import('./pages/ESingle.vue'),
                props: true,
            },
            {
                path: ':entryId(.*)',
                props: true,
                component: () => import('./pages/ESingle.vue'),
            },
        ],
    })
}
