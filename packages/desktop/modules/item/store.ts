import { defineStore } from 'pinia'

import { useStore as useWorkspace } from '@/modules/workspace/store'
import { useStore as useEntry } from '@/modules/entry/store'

import ListItemsDTO from '@/../core/use-cases/list-items/list-items.dto'
import { useCase } from '@/composables/use-case'
import { waitFor } from '@/composables/utils'

import UpdateItemDTO from '@core/use-cases/update-item/update-item.dto'
import CreateItemDTO from '@core/use-cases/create-item/create-item.dto'
import DeleteItemDTO from '@core/use-cases/delete-item/delete-item.dto'
import ShowItemDTO from '@/../core/use-cases/show-item/show-item.dto'

export const useStore = defineStore('item', () => {
    const workspace = useWorkspace()
    const entry = useEntry()

    const loading = new Map<string, boolean>()

    async function list(payload: Partial<ListItemsDTO.Input>) {
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

        loading.set(collectionId, true)

        return useCase('list-items', payload as any).finally(() => loading.delete(collectionId))
    }

    function show(payload: Partial<ShowItemDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase('show-item', payload as any)
    }

    function create(payload: Partial<CreateItemDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase('create-item', payload as any)
    }

    function update(payload: Partial<UpdateItemDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase('update-item', payload as any)
    }

    function destroy(payload: Partial<DeleteItemDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase('delete-item', payload as any)
    }

    return {
        workspace,
        entry,

        list,
        show,
        create,
        update,
        destroy,
    }
})
