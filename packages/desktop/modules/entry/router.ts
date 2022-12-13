import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/entries',
        component: () => import('@/modules/workspace/WLayout.vue'),
        children: [
            {
                path: '',
                component: () => import('./views/EList.vue'),
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
