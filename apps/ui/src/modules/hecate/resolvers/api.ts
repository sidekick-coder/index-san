import { defineImportResolver } from "hecate/composables/defineImportResolver"

export const apiResolver = defineImportResolver({
	test: (path: string) => path === 'app:api',
	resolve: async () => {
        const { user } = useAuth()

		return {
            api: $api,
            user,
            isLogged: computed(() => !!user.value),

		} 
	}
})

