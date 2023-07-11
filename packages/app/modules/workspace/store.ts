import { defineStore } from 'pinia'

import { useCase } from '@composables/use-case'

import Workspace from '@index-san/core/entities/workspace'
import { computed, ref } from 'vue'
import { useState } from '@composables/state'

export const useStore = defineStore('workspace', () => {
    const workspaces = ref<Workspace[]>([])

    const currentId = useState<string | null>('workspaces:currentId', null, {
        localStorage: true,
    })

    const current = computed(() => workspaces.value.find((w) => w.id === currentId.value))

    async function setWorkspaces() {
        await useCase('list-workspaces')
            .then(({ data }) => (workspaces.value = data))
            .catch(() => (workspaces.value = []))
    }

    async function create(data: Partial<Workspace>) {
        const workspace = await useCase('create-workspace', data as any)

        workspaces.value.push(workspace)

        return workspace
    }

    async function update(id: string, data: Partial<Workspace>) {
        await useCase('update-workspace', {
            workspaceId: id,
            data,
        })

        await setWorkspaces()
    }

    async function destroy(workspaceId: string) {
        const index = workspaces.value.findIndex((w) => w.id === workspaceId)

        await useCase('delete-workspace', { workspaceId })

        if (index !== -1) {
            workspaces.value.splice(index, 1)
        }
    }

    return {
        workspaces,
        currentId,
        current,

        setWorkspaces,
        create,
        update,
        destroy,
    }
})
