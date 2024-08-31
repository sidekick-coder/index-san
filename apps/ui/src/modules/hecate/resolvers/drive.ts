import { defineImportResolver } from "hecate/composables/defineImportResolver"

export const driveResolver = defineImportResolver({
	test: (path: string) => path === 'app:drive',
	resolve: async () => {
		const { drive, encode, decode } = useDrive()

		return {
			drive: unref(drive),
			encode,
			decode
		}
	}
})

