import { defineStore } from 'pinia'

import { ListWorkspacesDTO } from '@core/use-cases/list-workspaces/list-workspaces.dto'

import { useCase } from '@/composables/use-case'

import Workspace from '@core/entities/workspace'
import { computed, ref } from 'vue'
import { useState } from '@/composables/state'

export const useStore = defineStore('workspace', () => {
    const workspaces = ref<Workspace[]>([])

    const currentId = useState<string | null>('workspaces:currentId', null, {
        localStorage: true,
    })

    const current = computed(() => workspaces.value.find((w) => w.id === currentId.value))

    async function setWorkspaces() {
        await useCase<ListWorkspacesDTO.Output>('list-workspaces')
            .then(({ data }) => (workspaces.value = data))
            .catch(() => (workspaces.value = []))
    }

    async function create(data: Partial<Workspace>) {
        return useCase('create-workspace', data)
    }

    async function destroy(id: string) {
        await useCase('delete-workspace', { id })
    }

    return {
        workspaces,
        currentId,
        current,

        setWorkspaces,
        create,
        destroy,
    }
})
