import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import get from 'lodash/get'

import Collection from '@core/entities/collection'
import Column from '@core/entities/column'

import { useStore as useWorkspace } from '@/modules/workspace/store'
import { useStore as useItem } from '@/modules/item/store'
import { useStore as useView } from '@/modules/view/store'
import { useCase } from '@/composables/use-case'

import UpdateCollectionsDTO from '@core/use-cases/update-collection/update-collection.dto'
import CreateCollectionDTO from '@core/use-cases/create-collection/create-collection.dto'
import DeleteCollectionsDTO from '@core/use-cases/delete-collection/delete-collection.dto'
import ShowCollectionsDTO from '@core/use-cases/show-collection/show-collection.dto'

import { useNonReactive } from '@/composables/utils'

export const useStore = defineStore('collections', () => {
    const collections = ref<Collection[]>([])

    const workspace = useWorkspace()
    const item = useItem()
    const view = useView()

    // create column
    async function createColumn(collectionId: string) {
        const collection = collections.value.find((c) => c.id === collectionId)

        if (!collection) return

        const oldColumns = useNonReactive(collection.columns)
        const newColumns = useNonReactive(oldColumns)

        newColumns.push(new Column({ label: 'New' }))

        collection.columns = newColumns

        await update({
            collectionId: collection.id,
            data: {
                columns: newColumns,
            },
        }).catch(() => (collection.columns = oldColumns))
    }

    // update column
    async function updateColumn(column: Column, collectionId: string) {
        const collection = collections.value.find((c) => c.id === collectionId)

        if (!collection) return

        const oldColumns = useNonReactive(collection.columns)

        const newColumns = useNonReactive(oldColumns).map((c) => (c.id === column.id ? column : c))

        collection.columns = newColumns

        await update({
            collectionId: collection.id,
            data: {
                columns: newColumns,
            },
        }).catch(() => (collection!.columns = oldColumns))
    }

    // delete column
    async function deleteColumn(column: Column, collectionId: string) {
        const collection = collections.value.find((c) => c.id === collectionId)

        if (!collection) return

        const oldColumns = useNonReactive(collection.columns)

        const newColumns = useNonReactive(oldColumns).filter((c) => c.id !== column.id)

        collection.columns = newColumns

        await update({
            collectionId: collection.id,
            data: {
                columns: newColumns,
            },
        }).catch(() => (collection!.columns = oldColumns))
    }

    async function setCollections(workspaceId = workspace.currentId as string) {
        return await useCase('list-collections', {
            workspaceId,
        })
            .then((r) => (collections.value = get(r, 'data', [])))
            .catch(() => (collections.value = [] as Collection[]))
    }

    async function show(payload: Partial<ShowCollectionsDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase('show-collection', payload as any)
    }

    async function create(payload: Partial<CreateCollectionDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        await useCase('create-collection', payload as any)

        await setCollections()
    }

    async function update(payload: Partial<UpdateCollectionsDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        await useCase('update-collection', payload as any)
    }

    async function destroy(payload: Partial<DeleteCollectionsDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        await useCase('delete-collection', payload as any)

        await setCollections()
    }

    watch(() => workspace.currentId, setCollections)

    return {
        workspace,
        item,
        view,

        createColumn,
        updateColumn,
        deleteColumn,

        collections,

        setCollections,
        show,
        create,
        update,
        destroy,
    }
})
