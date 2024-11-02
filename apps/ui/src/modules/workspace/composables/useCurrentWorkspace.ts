import type { Workspace } from "./useWorkspaces"

const workspace = ref<Workspace>()

export function provideCurrentWorkspace(payload: Workspace) {
	workspace.value = payload
}

export function useCurrentWorkspace() {
	const result = unref(workspace)

	if (!result) {
		throw new Error('Error loading current workspace')
	}

	return result
}
