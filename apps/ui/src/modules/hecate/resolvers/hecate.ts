import { defineImportResolver } from "hecate/composables/defineImportResolver"
import { importJavascriptFile } from "./javascript"
import { importJson, writeJson } from "./json"

export const hecateResolver = defineImportResolver({
	test: (path: string) => path === 'app:hecate',
	resolve: async () => {
		return {
			importJS: importJavascriptFile,
            importJson: importJson,
            writeJson: writeJson
		} 
	}
})

