import { RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        redirect: '/workspaces',
    },
    {
        path: '/workspaces',
        name: 'workspaces-list',
        component: () => import('../pages/workspaces/list.vue')
    },
    {
        path: '/workspaces/:id',
        name: 'workspaces-single',
        props: true,
        component: () => import('../pages/workspaces/single.vue')
    },

    // keep this section in the end
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('../pages/404.vue')
    },
]

export default routes