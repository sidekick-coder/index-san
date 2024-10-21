import { defineImportResolver } from "hecate/composables/defineImportResolver"
import { importJavascriptFile } from "./javascript"

export const hecateResolver = defineImportResolver({
	test: (path: string) => path === 'app:hecate',
	resolve: async () => {
		return {
			importJS: importJavascriptFile
		} 
	}
})

