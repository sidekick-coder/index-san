import { defineImportResolver } from 'hecate/composables/defineImportResolver';

export const vueResolver = defineImportResolver({
	test: (path: string) => path === 'vue',
	resolve: async () => import('vue')
})

