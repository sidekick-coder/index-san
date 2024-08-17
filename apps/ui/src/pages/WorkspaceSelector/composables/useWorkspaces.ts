import { get, set } from 'idb-keyval'
import uuid from 'uuid-random'


export function useWorkspaces(){
    const loading = ref(false)
    const workspaces = ref<Workspace[]>([])

    async function load(){
        loading.value = true

        const data = await get('workspaces')

        if(data){
            workspaces.value = data
        }

        loading.value = false
    }

    async function save(workspace: Pick<Workspace, 'handle'|'label'>){
        const data = workspaces.value.map(w => ({
            id: w.id,
            label: w.label,
            handle: w.handle        
        }))

        data.push({
            id: uuid(),
            ...workspace
        })

        await set('workspaces', data)

        workspaces.value = data
    }

    async function verifyPermission(workspace: Workspace){
        const options = {
            mode: 'readwrite',
        }

        if (await workspace.handle.queryPermission(options) === 'granted') {
            return true
        }

        if (await workspace.handle.requestPermission(options) === 'granted') {
            return true
        }

        return false
    }

    return { workspaces, load, save, loading, verifyPermission }
}
