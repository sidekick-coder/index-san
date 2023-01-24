import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import Collection from '@core/entities/collection'

import { useStore as useWorkspace } from '@modules/workspace/store'
import { useCase } from '@composables/use-case'

import UpdateCollectionsDTO from '@core/use-cases/update-collection/update-collection.dto'
import CreateCollectionDTO from '@core/use-cases/create-collection/create-collection.dto'
import DeleteCollectionsDTO from '@core/use-cases/delete-collection/delete-collection.dto'
import ShowCollectionsDTO from '@core/use-cases/show-collection/show-collection.dto'
import { useViewStore } from '@modules/view/store'
import { useItemStore } from '@modules/item/store'

export const useStore = defineStore('collection', () => {
    const workspace = useWorkspace()

    const collections = ref<Collection[]>([])

    async function setCollections(workspaceId = workspace.currentId) {
        if (!workspaceId) {
            collections.value = []
            return
        }

        return await useCase('list-collections', {
            workspaceId,
        })
            .then((r) => (collections.value = r.data))
            .catch(() => (collections.value = [] as Collection[]))
    }

    function get(collectionId: string) {
        const collection = collections.value.find((c) => c.id === collectionId)

        if (collection) return collection

        return null
    }

    async function show(payload: Partial<ShowCollectionsDTO>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase('show-collection', payload as any)
    }

    async function create(payload: Collection) {
        const response = await useCase('create-collection', {
            workspaceId: workspace.currentId!,
            data: payload,
        })

        collections.value.push(response.data)

        return response.data
    }

    async function update(id: string, payload: Partial<Collection>) {
        const index = collections.value.findIndex((c) => c.id === id)

        const response = await useCase('update-collection', {
            workspaceId: workspace.currentId!,
            collectionId: id,
            data: payload,
        })

        if (index >= 0) {
            collections.value.splice(index, 1, response.data)
        }

        releaseCollection(id)

        return response.data
    }

    async function destroy(id: string) {
        const index = collections.value.findIndex((c) => c.id === id)

        await useCase('delete-collection', {
            workspaceId: workspace.currentId!,
            collectionId: id,
        })

        if (index >= 0) {
            collections.value.splice(index, 1)
        }

        releaseCollection(id)
    }

    function releaseCollection(id: string) {
        const stores = [useViewStore(id), useItemStore(id)]

        stores.forEach((store) => {
            store.clear()
            store.$dispose()
        })
    }

    watch(() => workspace.currentId, setCollections)

    return {
        collections,

        setCollections,
        get,
        show,
        create,
        update,
        destroy,
        releaseCollection,
    }
})
