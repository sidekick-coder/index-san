
const filename = '/.is/config.json'

export interface IsConfigPlugin {
	id: string
	active: boolean
}

export interface IsConfig {
	name: string
	activePlugins: IsConfigPlugin[]
}

export const $config = reactive<IsConfig>({
	name: '',
	activePlugins: []
})

export async function saveConfig(payload: Partial<IsConfig>) {
	const drive = useWorkspaceDrive() 

	const config = {...$config, ...payload}

	await drive.write(filename, JSON.stringify(config, null, 4))
}

export async function loadConfig(){
	const drive = useWorkspaceDrive() 

	const fileExists = await drive.get(filename)

	if (!fileExists) {
		await saveConfig({
			name: $workspace.label || 'MyWorkspace',
			activePlugins: []
		})
	}

	const contents = await drive.read(filename)

	const data = JSON.parse(decode(contents!))

	Object.assign($config, data)

	console.log('[app] config loaded', $config)
}
