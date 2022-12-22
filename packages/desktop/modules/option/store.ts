import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import get from 'lodash/get'

import ShowWorkspaceOptionsDTO from '@core/use-cases/show-workspace-options/show-workspace-options.dto'

import { useStore as useWorkspace } from '@/modules/workspace/store'
import { useCase } from '@/composables/use-case'

interface Menu {
    label: string
    to: string
    icon?: string
    section?: string
}

interface Options {
    menu?: Menu[]
    [key: string]: any
}

interface SaveArgs {
    workspaceId?: string
    data: any
}

export const useStore = defineStore('option', () => {
    const options = ref<Options>({
        menu: [],
    })

    const workspace = useWorkspace()

    async function setOptions(workspaceId = workspace.currentId) {
        await useCase('show-workspace-options', {
            workspaceId: workspaceId || workspace.currentId!,
        })
            .then((r) => (options.value = get(r, 'data', {})))
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
