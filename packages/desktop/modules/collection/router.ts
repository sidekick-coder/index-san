import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/workspaces/:workspaceId/collections',
        component: () => import('./CLayout.vue'),
        children: [
            {
                path: '',
                component: () => import('./views/CList.vue'),
                props: true,
            },
        ],
    })
}
