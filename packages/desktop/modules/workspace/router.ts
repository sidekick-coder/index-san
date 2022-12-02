import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/workspaces',
        component: () => import('./WLayout.vue'),
        children: [
            {
                path: '',
                component: () => import('./views/WList.vue'),
            },
        ],
    })
}
