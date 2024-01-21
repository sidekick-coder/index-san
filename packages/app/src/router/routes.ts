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
    {
        path: '/file-explorer',
        name: 'FileExplorer',
        component: () => import('@/pages/FileExplorer/FileExplorer.vue'),
    },
    {
        path: '/file-explorer/:path(.*)*',
        name: 'FileExplorerFolder',
        props: true,
        component: () => import('@/pages/FileExplorer/FileExplorer.vue'),
    }

]

export default routes