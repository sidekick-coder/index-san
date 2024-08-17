
const filename = '/.is/config.json'

export interface IsConfigPlugin {
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

export async function saveConfig(payload: IsConfig) {
	const { drive } = useDrive()

	await drive.value.write(filename, JSON.stringify(payload, null, 4))
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
