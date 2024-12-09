import { defineImportResolver } from "hecate/composables/defineImportResolver"
import get from 'lodash/get'
import set from 'lodash/set'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import { useRouteQuery } from '@vueuse/router'


export const utilsResolver = defineImportResolver({
	test: (path: string) => path === 'app:utils',
	resolve: async () => {
		return {
            hasPlugin,
            useState,
			tryCatch,
            debounce,
            throttle,
            get,
            set,
            useRouteQuery,
            copy,
            until,
		} 
	}
})

