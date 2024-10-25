import { defineImportResolver } from "hecate/composables/defineImportResolver"
import get from 'lodash/get'

export const utilsResolver = defineImportResolver({
	test: (path: string) => path === 'app:utils',
	resolve: async () => {
		return {
			tryCatch,
            get
		} 
	}
})

