import { defineImportResolver } from "hecate/composables/defineImportResolver"

export const utilsResolver = defineImportResolver({
	test: (path: string) => path === 'app:utils',
	resolve: async () => {
		return {
			tryCatch
		} 
	}
})

