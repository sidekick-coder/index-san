import { defineImportResolver } from "hecate/composables/defineImportResolver"

export const snackbarResolver = defineImportResolver({
	test: (path: string) => path === 'app:snackbar',
	resolve: async () => {
		return {
			default: $snackbar
		} 
	}
})

