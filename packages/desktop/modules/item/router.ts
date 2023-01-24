import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute('main', {
        path: '/collections/:collectionId/items/:itemId',
        component: () => import('./pages/ISingle.vue'),
        props: true,
    })

    router.addRoute('main', {
        path: '/collections/:collectionId/items',
        component: () => import('./pages/IList.vue'),
        props: true,
    })

    // router.addRoute({
    //     path: '/collections/:collectionId/items',
    //     component: () => import('./ILayout.vue'),
    //     children: [
    //         {
    //             path: '',
    //             component: () => import('./pages/IList.vue'),
    //             props: true,
    //         },
    //     ],
    // })
}
