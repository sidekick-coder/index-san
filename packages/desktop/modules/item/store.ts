import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useStore as useWorkspace } from '@/modules/workspace/store'
import { useStore as useEntry } from '@/modules/entry/store'

import ListItemsDTO from '@/../core/use-cases/list-items/list-items.dto'
import { useCase } from '@/composables/use-case'

import UpdateItemDTO from '@core/use-cases/update-item/update-item.dto'
import CreateItemDTO from '@core/use-cases/create-item/create-item.dto'
import DeleteItemDTO from '@core/use-cases/delete-item/delete-item.dto'
import ShowItemDTO from '@core/use-cases/show-item/show-item.dto'

import Item from '@core/entities/item'
import Collection from '@/../core/entities/collection'
import { useNonReactive, waitFor } from '@/composables/utils'
import { ViewFilter } from '@/../core/entities/view'
import { filter } from '../collection/composables/filter'
import { ColumnType } from '@/../core/entities/column'

export const useStore = defineStore('item', () => {
    const workspace = useWorkspace()
    const entry = useEntry()

    const current = ref({
        loading: false,
        items: [] as Item[],
        filters: [] as ViewFilter[],
        collection: null as Collection | null,
    })

    async function setItems(filters: ViewFilter[] = [], search = '') {
        if (!current.value.collection) {
            current.value.items = []
            return
        }

        if (current.value.loading) {
            waitFor(() => !current.value.loading)
        }

        current.value.loading = true

        const raw: Item[] = await useCase('list-items', {
            workspaceId: workspace.currentId!,
            collectionId: current.value.collection.id,
        })
            .then((r) => r.data)
            .catch(() => [])

        current.value.filters = filters

        current.value.items = raw.filter((i) => {
            let valid = !!JSON.stringify(i).toLowerCase().includes(search.toLowerCase())

            valid = filters.reduce((r, f) => r && filter(i, f), valid)

            return valid
        })

        setTimeout(() => (current.value.loading = false), 800)
    }

    async function list(payload: Partial<ListItemsDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase('list-items', payload as any)
    }

    async function create() {
        if (!current.value.collection) return

        const payload = {}

        const safeList = [
            ColumnType.text,
            ColumnType.select,
            ColumnType.number,
            ColumnType.relation,
        ]

        current.value.filters.forEach((f) => {
            const column = current.value.collection?.columns.find((c) => c.id === f.columnId)

            if (!column || !column.type || !column.field) return

            if (safeList.includes(column.type)) {
                payload[column.field] = f.value
            }
        })

        const item = new Item(payload)

        current.value.items.push(item)

        await useCase('create-item', {
            collectionId: current.value.collection.id,
            workspaceId: workspace.currentId!,
            data: item,
        }).catch(() => {
            const index = current.value.items.indexOf(item)

            if (index !== -1) {
                current.value.items.splice(index, 1)
            }
        })
    }

    async function update(item: Item, field: string, value: any) {
        if (!current.value.collection) return

        const old = useNonReactive(item)

        item[field] = value

        const payload = {
            collectionId: current.value.collection.id,
            workspaceId: workspace.currentId!,
            itemId: old.id,
            data: {
                [field]: value,
            },
        }

        await useCase('update-item', payload).catch(() => (item[field] = old))
    }

    async function destroy(item: Item) {
        if (!current.value.collection) return

        const index = current.value.items.indexOf(item)

        const old = useNonReactive(item)

        if (index === -1) return

        current.value.items.splice(index, 1)

        await useCase('delete-item', {
            collectionId: current.value.collection.id,
            workspaceId: workspace.currentId!,
            itemId: old.id,
        }).catch(() => current.value.items.push(old))
    }

    return {
        workspace,
        entry,

        current,
        setItems,

        list,

        create,
        update,
        destroy,
    }
})
