import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/workspaces/:workspaceId/scripts',
        component: () => import('@/modules/workspace/WLayout.vue'),
        children: [
            {
                path: '',
                component: () => import('./views/SList.vue'),
                props: true,
            },
            {
                path: ':name',
                props: true,
                component: () => import('./views/SSingle.vue'),
            },
        ],
    })
}
