import { defineImportResolver } from "hecate/composables/defineImportResolver"

export const dialogResolver = defineImportResolver({
	test: (path: string) => path === 'app:dialog',
	resolve: async () => {
		return {
            default: $dialog
        } 
	}
})

