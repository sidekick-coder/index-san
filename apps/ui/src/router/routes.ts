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
        path: '/entries/:path(.*)*',
        name: 'EntryProvider',
        props: true,
        component: () => import('@/pages/EntryProvider/EntryProvider.vue'),
    },
    {
        path: '/app-pages/:name',
        name: 'AppPageProvider',
        props: true,
        component: () => import('@/pages/AppPage/AppPage.vue'),
    },
    {
        path: '/cheat-sheet',
        name: 'CheatSheet',
        component: () => import('@/pages/CheatSheet/CheatSheet.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/pages/NotFound/NotFound.vue'),
    },

]

export default routes