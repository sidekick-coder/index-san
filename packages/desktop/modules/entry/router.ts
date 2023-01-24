import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute('main', {
        path: '/entries',
        component: () => import('./ELayout.vue'),
        props: true,
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
