import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute({
        path: '/options',
        component: () => import('./OLayout.vue'),
        redirect: '/options/general',
        children: [
            {
                path: 'general',
                component: () => import('./views/OGeneral.vue'),
            },
            {
                path: 'menu',
                component: () => import('./views/OMenu.vue'),
            },
            {
                path: 'theme',
                component: () => import('./views/OTheme.vue'),
            },
        ],
    })
}
