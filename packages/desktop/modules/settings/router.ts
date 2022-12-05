import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/settings',
        component: () => import('./SLayout.vue'),
        redirect: '/settings/general',
        children: [
            {
                path: 'general',
                component: () => import('./views/general.vue'),
            },
            {
                path: 'menu',
                component: () => import('./views/menu.vue'),
            },
            {
                path: 'theme',
                component: () => import('./views/theme.vue'),
            },
        ],
    })
}
