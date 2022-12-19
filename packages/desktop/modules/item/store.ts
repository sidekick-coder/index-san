import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useStore as useWorkspace } from '@/modules/workspace/store'
import { useStore as useEntry } from '@/modules/entry/store'
import { useStore as useCollection } from '@/modules/collection/store'

import ListItemsDTO from '@/../core/use-cases/list-items/list-items.dto'
import { useCase } from '@/composables/use-case'

import Item from '@core/entities/item'
import Collection from '@/../core/entities/collection'
import { useNonReactive, waitFor } from '@/composables/utils'
import { ViewFilter } from '@/../core/entities/view'
import { filter } from '../collection/composables/filter'
import { ColumnType } from '@/../core/entities/column'

interface Register {
    collectionId: string
    items: Item[]
    loading: boolean
    filters: ViewFilter[]
    search: string
}

export const useStore = defineStore('item', () => {
    const workspace = useWorkspace()
    const collectionStore = useCollection()
    const entry = useEntry()

    const registers = ref<Register[]>([])

    function getRegister(collectionId: string): Register {
        let result = registers.value.find((r) => r.collectionId === collectionId)

        if (result) return result

        result = {
            collectionId,
            search: '',
            loading: false,
            filters: [],
            items: [],
        }

        registers.value.push(result)

        return result
    }

    async function setRegister(collectionId: string, payload?: Partial<Register>) {
        const data = getRegister(collectionId)

        data.filters = payload?.filters || []
        data.search = payload?.search || ''

        data.loading = true

        const raw: Item[] = await useCase('list-items', {
            workspaceId: workspace.currentId!,
            collectionId,
        })
            .then((r) => r.data)
            .catch(() => [])

        data.items = raw.filter((i) => {
            let valid = !!JSON.stringify(i).toLowerCase().includes(data.search.toLowerCase())

            valid = data.filters.reduce((r, f) => r && filter(i, f), valid)

            return valid
        })

        setTimeout(() => {
            data!.loading = false
            registers.value = registers.value.slice()
        }, 800)
    }

    async function list(payload: Partial<ListItemsDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase('list-items', payload as any)
    }

    async function create(collectionId: string) {
        const register = registers.value.find((r) => r.collectionId === collectionId)
        const collection = collectionStore.collections.find((c) => c.id === collectionId)

        if (!collection || !register) return

        const payload = {}

        const safeList = [
            ColumnType.text,
            ColumnType.select,
            ColumnType.number,
            ColumnType.relation,
        ]

        register.filters.forEach((f) => {
            const column = collection.columns.find((c) => c.id === f.columnId)

            if (!column || !column.type || !column.field) return

            if (safeList.includes(column.type)) {
                payload[column.field] = f.value
            }
        })

        const item = new Item(payload)

        register.items.push(item)

        await useCase('create-item', {
            collectionId,
            workspaceId: workspace.currentId!,
            data: item,
        }).catch(() => {
            const index = register.items.indexOf(item)

            if (index !== -1) {
                register.items.splice(index, 1)
            }
        })
    }

    async function update(collectionId: string, item: Item, field: string, value: any) {
        const register = registers.value.find((r) => r.collectionId === collectionId)
        const collection = collectionStore.collections.find((c) => c.id === collectionId)

        if (!collection || !register) return

        const old = useNonReactive(item)

        item[field] = value

        const payload = {
            collectionId,
            workspaceId: workspace.currentId!,
            itemId: old.id,
            data: {
                [field]: value,
            },
        }

        await useCase('update-item', payload).catch(() => (item[field] = old))
    }

    async function destroy(collectionId: string, item: Item) {
        const register = registers.value.find((r) => r.collectionId === collectionId)
        const collection = collectionStore.collections.find((c) => c.id === collectionId)

        if (!collection || !register) return

        const index = register.items.indexOf(item)

        const old = useNonReactive(item)

        if (index === -1) return

        register.items.splice(index, 1)

        await useCase('delete-item', {
            collectionId: collection.id,
            workspaceId: workspace.currentId!,
            itemId: old.id,
        }).catch(() => register.items.push(old))
    }

    return {
        workspace,
        entry,

        getRegister,
        setRegister,

        list,

        create,
        update,
        destroy,
    }
})
