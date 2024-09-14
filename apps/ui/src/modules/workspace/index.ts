
export default defineAppModule({
	order: 1,
	async setup({ addRoute }) {
		addRoute({
			path: '/',
			redirect: '/workspaces',
		})

		addRoute({
			path: '/workspaces',
			component: () => import('./pages/WorkspaceList.vue'),
		})

		addRoute({
			name: 'workspace',
			path: '/workspaces/:workspaceId',
			component: () => import('./WorkspaceLayout.vue'),
			children: []
		})
	}
})
