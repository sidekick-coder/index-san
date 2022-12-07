import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import { useCase } from '@/composables/use-case'
import { useStore as useWorkspace } from '@/modules/workspace/store'
import Script from '@core/entities/script'

import ListScriptsDTO from '@core/use-cases/list-scripts/list-scripts.dto'
import CreateScriptDTO from '@core/use-cases/create-script/create-script.dto'
import DeleteScriptDTO from '@core/use-cases/delete-script/delete-script.dto'
import UpdateScriptDTO from '@/../core/use-cases/update-script/update-script.dto'
import ExecuteScriptDTO from '@/../core/use-cases/execute-script/execute-script.dto'

export const useStore = defineStore('script', () => {
    const scripts = ref<Script[]>([])

    const workspace = useWorkspace()

    async function setScrips(workspaceId = workspace.currentId) {
        await useCase<ListScriptsDTO.Output>('list-scripts', { workspaceId })
            .then(({ data }) => (scripts.value = data))
            .catch(() => (scripts.value = []))
    }

    async function create(payload: Partial<CreateScriptDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        await useCase('create-script', payload)

        await setScrips()
    }

    async function update(payload: Partial<UpdateScriptDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        await useCase('update-script', payload)

        await setScrips()
    }

    async function destroy(payload: Partial<DeleteScriptDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        await useCase('delete-script', payload)

        await setScrips()
    }

    async function execute(payload: Partial<ExecuteScriptDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return await useCase('execute-script', payload)
            .then((r) => r)
            .catch((err) => ({
                loading: false,
                logs: [],
                error: err.message ?? 'Error executing script',
                result: null as null | any,
            }))
    }

    watch(() => workspace.currentId, setScrips)

    return {
        scripts,

        setScrips,
        create,
        update,
        destroy,
        execute,
    }
})
