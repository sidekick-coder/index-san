import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/collections/:collectionId',
        component: () => import('./pages/CSingle.vue'),
        props: true,
    })

    router.addRoute({
        path: '/collections',
        component: () => import('@modules/entry/ELayout.vue'),
        children: [
            {
                path: '',
                component: () => import('./pages/CList.vue'),
                props: true,
            },
            {
                path: ':collectionId',
                component: () => import('./pages/CSingle.vue'),
                props: true,
            },
        ],
    })
}
