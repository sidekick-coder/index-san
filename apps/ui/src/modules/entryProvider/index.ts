import { workspaceGuard } from '@/router/guards/workspaceGuard'

export default defineAppModule({
    setup({ addRoute }) {
        addRoute({
            path: '/entries/:path(.*)*',
            props: true,
            component: () => import('./components/EntryProvider.vue'),
			beforeEnter: workspaceGuard
        })
    }
})
