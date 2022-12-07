import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/collections',
        component: () => import('@/modules/workspace/WLayout.vue'),
        children: [
            {
                path: '',
                component: () => import('./views/CList.vue'),
                props: true,
            },
        ],
    })
}
