import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/collections/:collectionId/items',
        component: () => import('./ILayout.vue'),
        children: [
            {
                path: '',
                component: () => import('./pages/IList.vue'),
                props: true,
            },
        ],
    })
}
