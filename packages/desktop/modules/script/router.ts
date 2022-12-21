import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/scripts',
        component: () => import('./SLayout.vue'),
        children: [
            {
                path: '',
                component: () => import('./pages/SList.vue'),
                props: true,
            },
            {
                path: ':id',
                props: true,
                component: () => import('./pages/SSingle.vue'),
            },
        ],
    })
}
