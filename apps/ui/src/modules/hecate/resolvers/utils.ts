import { defineImportResolver } from "hecate/composables/defineImportResolver"
import get from 'lodash/get'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

export const utilsResolver = defineImportResolver({
	test: (path: string) => path === 'app:utils',
	resolve: async () => {
		return {
			tryCatch,
            debounce,
            throttle,
            get
		} 
	}
})

