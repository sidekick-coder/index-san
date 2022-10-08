import { RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        redirect: '/workspaces',
    },
    // workspaces
    {
        path: '/workspaces',
        component: () => import('../pages/workspaces/list.vue')
    },
    {
        path: '/workspaces/:workspaceId',
        props: true,
        component: () => import('../pages/workspaces/single.vue'),
        meta: {
            layout: 'workspace'
        }
    },

    // directory-entries
    {
        path: '/workspaces/:workspaceId/entry-folder',
        props: true,
        component: () => import('../pages/entry/folder.vue'),
        children: [
            {
                path: '/:workspaceId',
                props: true,
                component: () => import('../pages/entry/folder.vue'),
            },
            {
                path: ':entryId(.*)',
                props: true,
                component: () => import('../pages/entry/folder.vue'),
            },
        ]
    },

    {
        path: '/workspaces/:workspaceId/entry/:entryId(.*)',
        props: true,
        component: () => import('../pages/entry/default.vue')
    },
    // collections
    {
        path: '/workspaces/:workspaceId/collections',
        props: true,
        component: () => import('../pages/collections/list.vue')
    },
    // items
    {
        path: '/workspaces/:workspaceId/collections/:collectionId/items',
        props: true,
        component: () => import('../pages/items/items.vue')
    },
    // 404 - keep this section in the end
    {
        path: '/:pathMatch(.*)*',
        component: () => import('../pages/404.vue')
    },
]

export default routes