import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/collections/:collectionId/items',
        component: () => import('./ILayout.vue'),
        children: [
            {
                path: '',
                component: () => import('./views/IList.vue'),
                props: true,
            },
        ],
    })
}
