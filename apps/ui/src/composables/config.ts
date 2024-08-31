
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
	const { drive } = useDrive()

	const config = {...$config, ...payload}

	await drive.value.write(filename, JSON.stringify(config, null, 4))
}

export async function loadConfig(){

	const { drive, decode } = useDrive()

	const fileExists = await drive.value.get(filename)

	if (!fileExists) {
		await saveConfig({
			name: $workspace.label || 'MyWorkspace',
			activePlugins: []
		})
	}

	const contents = await drive.value.read(filename)

	const data = JSON.parse(decode(contents!))

	Object.assign($config, data)

}
