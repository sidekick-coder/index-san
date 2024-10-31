export interface IsPluginManifest {
	name: string
	imports?: any[],
	components?: any[],
	pages?: any[]
	menu?: any[]
	middlewares?: any[]
    order?: number
}

export interface IsPluginInfo extends Required<IsPluginManifest> {
	id: string
	active: boolean
}


export async function listPlugins() {
	const folderPath = '/.is/plugins'

	const drive = useWorkspaceDrive() 

	const hasPluginFolder = await drive.get(folderPath)

	if (!hasPluginFolder) {
		return []
	}

	const entries = await drive.list(folderPath)

	const plugins: IsPluginInfo[] = []

	for await (const e of entries) {
		const hasManifest = await drive.get(resolve(e.path, 'manifest.json'))

		if (!hasManifest) continue

		const pluginConfig = $config.activePlugins.find(ap => ap.id === e.name)
		const contents = await drive.read(resolve(e.path, 'manifest.json'))
		
		const [json] = await tryCatch(() => contents ? JSON.parse(decode(contents)) : {})

		plugins.push({
			id: e.name,
			name: e.name,
			imports: [],
			pages: [],
			menu: [],
			components: [],
			middlewares: [],
            order: 999,
			...json,
			active: !!pluginConfig?.active
		})

	}

	return plugins as IsPluginInfo[]
}
