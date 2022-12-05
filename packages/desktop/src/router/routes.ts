import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    // settings
    {
        path: '/settings',
        component: () => import('../pages/settings/index.vue'),
        redirect: '/settings/general',
        children: [
            {
                path: 'general',
                component: () => import('../pages/settings/general.vue'),
            },
            {
                path: 'menu',
                component: () => import('../pages/settings/menu.vue'),
            },
            {
                path: 'theme',
                component: () => import('../pages/settings/theme.vue'),
            },
        ],
    },
    // scripts

    // 404 - keep this section in the end
    {
        path: '/:pathMatch(.*)*',
        component: () => import('../pages/404.vue'),
    },
]

export default routes
