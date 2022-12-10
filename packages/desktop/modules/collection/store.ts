import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import get from 'lodash/get'

import Collection from '@core/entities/collection'

import { useStore as useWorkspace } from '@/modules/workspace/store'
import { useCase } from '@/composables/use-case'

import ListCollectionsDTO from '@core/use-cases/list-collections/list-collections.dto'
import UpdateCollectionsDTO from '@core/use-cases/update-collection/update-collection.dto'
import CreateCollectionDTO from '@/../core/use-cases/create-collection/create-collection.dto'
import DeleteCollectionsDTO from '@/../core/use-cases/delete-collection/delete-collection.dto'

export const useStore = defineStore('collections', () => {
    const collections = ref<Collection[]>([])

    const workspace = useWorkspace()

    async function setCollections(workspaceId = workspace.currentId) {
        await useCase<ListCollectionsDTO.Output>('list-collections', {
            workspaceId,
        })
            .then((r) => (collections.value = get(r, 'data', [])))
            .catch(() => (collections.value = []))
    }

    async function create(payload: Partial<CreateCollectionDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        await useCase('create-collection', payload)

        await setCollections()
    }

    async function update(payload: Partial<UpdateCollectionsDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        await useCase('update-collection', payload)
    }

    async function destroy(payload: Partial<DeleteCollectionsDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        await useCase('delete-collection', payload)

        await setCollections()
    }

    watch(() => workspace.currentId, setCollections)

    return {
        collections,

        setCollections,
        create,
        update,
        destroy,
    }
})
