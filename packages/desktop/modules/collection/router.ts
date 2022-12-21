import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/collections/:collectionId',
        component: () => import('./views/CSingle.vue'),
        props: true,
    })

    router.addRoute({
        path: '/collections',
        component: () => import('@/modules/entry/ELayout.vue'),
        children: [
            {
                path: '',
                component: () => import('./views/CList.vue'),
                props: true,
            },
            {
                path: ':collectionId',
                component: () => import('./views/CSingle.vue'),
                props: true,
            },
        ],
    })
}
