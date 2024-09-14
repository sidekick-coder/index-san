export function useRouteEntryPath() {
	const route = useRoute()

	return computed(() => {
		const path = route.params.path

		const args = Array.isArray(path) ? path : [path]

		return decodeURIComponent(`${args.join('/')}`)
	})
}
