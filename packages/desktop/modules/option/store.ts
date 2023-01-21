import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import { useStore as useWorkspace } from '@modules/workspace/store'
import { useCase } from '@composables/use-case'

interface SaveArgs {
    workspaceId?: string
    data: any
}

export const useStore = defineStore('option', () => {
    const options = ref<any>({})

    const workspace = useWorkspace()

    async function setOptions(workspaceId = workspace.currentId) {
        if (!workspaceId) {
            options.value = {}
            return
        }

        await useCase('show-workspace-options', {
            workspaceId: workspaceId,
        })
            .then((r) => (options.value = r.data || {}))
            .catch(() => (options.value = {}))
    }

    async function save({ workspaceId, data }: SaveArgs) {
        await useCase('update-workspace-options', {
            workspaceId: workspaceId || workspace.currentId!,
            data,
        })
    }

    watch(() => workspace.currentId, setOptions)

    return {
        options,

        setOptions,
        save,
    }
})
