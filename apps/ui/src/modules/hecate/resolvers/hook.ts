import { defineImportResolver } from "hecate/composables/defineImportResolver"

export const hookResolver = defineImportResolver({
	test: (path: string) => path === 'app:hook',
	resolve: async () => {
		return {
			onHook: onHook,
			offHook: offHook,
			emitHook: emitHook,
		} 
	}
})

