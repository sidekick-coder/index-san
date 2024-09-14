import { defineImportResolver } from "hecate/composables/defineImportResolver"

export const driveResolver = defineImportResolver({
	test: (path: string) => path === 'app:drive',
	resolve: async () => {
		const drive = useWorkspaceDrive() 

		return {
			drive,
			encode,
			decode,
			resolve
		}
	}
})

