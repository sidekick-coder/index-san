import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/',
        redirect: '/workspaces',
    })

    router.addRoute({
        path: '/workspaces',
        component: () => import('./WLayout.vue'),
        children: [
            {
                path: '',
                component: () => import('./pages/WList.vue'),
            },
        ],
    })
}
