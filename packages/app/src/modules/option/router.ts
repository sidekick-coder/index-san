import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute('main', {
        path: 'options',
        component: () => import('./OLayout.vue'),
        redirect: '/options/general',
        children: [
            {
                path: 'general',
                component: () => import('./pages/OGeneral.vue'),
            },
            {
                path: 'menu',
                component: () => import('./pages/OMenu.vue'),
            },
            {
                path: 'theme',
                component: () => import('./pages/OTheme.vue'),
            },
        ],
    })
}
