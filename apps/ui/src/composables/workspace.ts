import { get, set } from 'idb-keyval'
import uuid from 'uuid-random'

export interface Workspace {
	id: string
	label: string
	handle: FileSystemDirectoryHandle
}

export const $workspace = reactive<Workspace>({} as any)

export async function listWorkspaces() {
	const data = await get('workspaces')

	return data || []
}

export async function loadWorkspace(workspace: Workspace) {

	$workspace.id = workspace.id
	$workspace.label = workspace.label
	$workspace.handle = workspace.handle

	loadDrive($workspace.handle)

	await loadConfig()

	await set('workspaces:last', {
		id: workspace.id,
		label: workspace.label,
		handle: workspace.handle
	})

	emitHook('workspace:loaded', { workspace })
}

export async function loadLastWorkspace(){
	const lastWorkspace = await get<Workspace>('workspaces:last')

	if (!lastWorkspace) return

	loadWorkspace(lastWorkspace)
}