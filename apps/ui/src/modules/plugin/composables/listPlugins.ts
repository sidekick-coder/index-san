export interface IsPluginInfo {
	id: string
	name: string
	active: boolean
}

export async function listPlugins() {
	const folderPath = '/.is/plugins'

	const { drive } = useDrive()

	const hasPluginFolder = await drive.value.get(folderPath)

	if (!hasPluginFolder) {
		return []
	}

	const entries = await drive.value.list(folderPath)

	const plugins = entries.map(e => {
		const pluginConfig = $config.activePlugins.find(ap => ap.id === e.name)

		return {
			id: e.name,
			name: e.name,
			active: !!pluginConfig?.active
		}
	})

	return plugins as IsPluginInfo[]

}
