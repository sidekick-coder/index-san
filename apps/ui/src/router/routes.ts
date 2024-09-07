import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/workspace-selector',
    },
    {
        path: '/workspace-selector',
        name: 'WorkspaceSelector',
        component: () => import('@/pages/WorkspaceSelector/WorkspaceSelector.vue'),
        meta: {
            layout: 'empty'
        },
    },
]

export default routes
