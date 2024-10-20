import { defineImportResolver } from 'hecate/composables/defineImportResolver';

export const vueRouterResolver = defineImportResolver({
	test: (path: string) => path === 'vue-router',
	resolve: async () => import('vue-router')
})

