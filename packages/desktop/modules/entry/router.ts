import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/entries',
        component: () => import('./ELayout.vue'),
        children: [
            {
                path: '',
                component: () => import('./views/ESingle.vue'),
                props: true,
            },
            {
                path: ':entryId(.*)',
                props: true,
                component: () => import('./views/ESingle.vue'),
            },
        ],
    })
}
