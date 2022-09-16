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
        path: '/workspaces/:workspaceId/directory-entries',
        name: 'directory-entry-default',
        props: true,
        component: () => import('../pages/directory-entries/default.vue')
    },
    // keep this section in the end
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('../pages/404.vue')
    },
]

export default routes