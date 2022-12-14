import { defineStore } from 'pinia'

import { useStore as useWorkspace } from '@/modules/workspace/store'
import ListItemsDTO from '@/../core/use-cases/list-items/list-items.dto'
import { useCase } from '@/composables/use-case'
import { waitFor } from '@/composables/utils'

export const useStore = defineStore('item', () => {
    const workspace = useWorkspace()
    const cache = new Map<string, ListItemsDTO.Output>()
    const loading = new Map<string, boolean>()

    async function list(payload: Partial<ListItemsDTO.Input>, ignoreCache = false) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        if (!payload.collectionId) {
            return {
                data: [],
            }
        }

        const { collectionId } = payload

        if (loading.has(collectionId)) {
            await waitFor(() => !loading.has(collectionId), 1000)
        }

        if (ignoreCache) {
            cache.delete(collectionId)
        }

        const value = cache.get(collectionId)

        if (value) {
            return value
        }

        loading.set(collectionId, true)

        return useCase<ListItemsDTO.Output>('list-items', payload)
            .then((response) => {
                cache.set(collectionId, response)

                return response
            })
            .finally(() => loading.delete(collectionId))
    }

    return {
        list,
    }
})
