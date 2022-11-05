<script lang="ts" setup>
import { computed, ref, shallowRef, useSlots, watch } from 'vue'

import { CollectionColumn } from '@core/entities/collection'
import Item from '@core/entities/item'

import { useItemRepository } from '@/composables/item'

import { useCollection, useCollectionAsync, useCollectionItemsAsync } from '@/composables/collection'
import { useRouter } from 'vue-router'
import { useChildren } from '@/composables/children'
import { useArray } from '@/composables/array'
import { useHooks } from '@/plugins/hooks'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    collectionId: {
        type: String,
        required: true,
    }
})

const children = useChildren(useSlots())
const router = useRouter()
const hooks = useHooks()

const crud = useItemRepository(props.workspaceId, props.collectionId)

const { items, filterArray } = useArray<Item>()

const loading = ref(false)
const filtersDrawer = ref(false)
const filters = ref<Record<string, string>>({})
const columns = ref<CollectionColumn[]>([])

const formattedItems = computed(() => items.value.map(item => {
    const data: any = {}

    columns.value.forEach(column => {
        data[column.field] = item[column.field]

        if (column.type === 'relation') {
            data[column.field] = column.options.get(item[column.field])
        }
    })

    return data
}))

const components = shallowRef<any[]>([])

function setViews(){
    components.value = []

    children.load()

    children.findComponent('IsTable', 'IsChartBar').forEach(c => {
        components.value.push(c)
    })
    
    children.findComponent('IsCollectionFilter').forEach(component => {
        const { field, value } = component.props ?? {}

        if (field && value) {
            filters.value[field] = value
        }

    })

}


async function setColumns(){
    const collection = await useCollectionAsync(props.workspaceId, props.collectionId) 

    columns.value = collection.value?.columns.slice() ?? []
    
    for await (const column of columns.value) {
        if (column.type === 'relation') {
            const relation = await useCollectionItemsAsync(props.workspaceId, column.collectionId)

            column.name = column.field
            column.options = new Map<string, string>()
            
            relation.value.forEach(i => column.options.set(i.id, i[column.displayField]))
        }
    }
}

async function setItems(){
    const data = await useCollectionItemsAsync(props.workspaceId, props.collectionId)

    items.value = data.value.slice()

    const params = columns.value
        .filter(c => !!filters.value[c.field])
        .map(c => ({
            type: c.type === 'relation' ? 'string' : c.type,
            key: c.field,
            value: filters.value[c.field]
        }))

    filterArray(...params)
}

async function load(){
    if (!props.workspaceId || !props.collectionId) return

    loading.value = true
    
    
    await setColumns()   
    
    setViews()

    await setItems()


    loading.value = false

    hooks.on({
        handler: load,
        name: `collection:${props.collectionId}:update`,
    })
}

watch(() => props.collectionId, load, {
    immediate: true,
})


async function onItemNew() {
    await crud.create()
}

async function onItemShow(item: any) {
    router.push({
        query: {
            showItem: 'true',
            itemId: item.id,
            workspaceId: props.workspaceId,
            collectionId: props.collectionId
        }
    })
}

async function onItemUpdate(item: any) {
    await crud.update(item.id, item)
}

async function onItemDelete(item: any) {
    await crud.destroy(item.id)
}


async function onColumnNew(){
    await useCollection(props.workspaceId, props.collectionId).addColumn()
}

async function clearFilters(){
    Object.keys(filters.value).forEach(key => {
        filters.value[key] = ''
    })

    await setItems()
}

</script>
<template>
    <div v-if="!loading" class="flex flex-wrap">
        <div class="border-b py-2 border-gray-700 w-full">
            <is-icon name="filter" class="cursor-pointer text-gray-500" @click="filtersDrawer = !filtersDrawer"  />
        </div>

        <teleport to="body">
            <div
                v-if="filtersDrawer"
                class="fixed inset-0 flex h-screen w-screen bg-black/30"
                @click="filtersDrawer = false"
            >
                <aside
                    class="fixed right-0 top-0 h-full border-l border-gray-700 w-[300px] bg-zinc-800"
                    @click.stop=""
                >
                    <w-form class="flex flex-wrap px-4 py-4" @submit="setItems">
                        <div class="w-full mb-4" v-for="(column, index) in columns" :key="index">
                            <w-select
                                v-if="column.type === 'select'"
                                v-model="filters[column.field]"
                                :label="column.label"
                                :options="column.options.split(',')"
                            />
    
                            <w-select
                                v-else-if="column.type === 'relation'"
                                v-model="filters[column.field]"
                                :label="column.label"
                                :options="Array.from(column.options.entries())"
                                label-key="1"
                                value-key="0"
                            />
    
                            <w-input
                                v-else
                                v-model="filters[column.field]"
                                :label="column.label"
                                class="text-white"
                            />
                        </div>
    
                        <div class="flex justify-between w-full">
                            <w-btn type="submit" class="w-5/12" color="teal" >Apply</w-btn>
                            <w-btn type="button" class="w-5/12" @click="clearFilters" >Clean</w-btn>
                        </div>
                    </w-form>
                </aside>
            </div>
        </teleport>

        <template v-for="(c, index) in components" :key="index">
            <component
                v-if="c.type.name === 'IsTable' "
                :is="c"
                :items="items"
                :columns="columns"
                @item:show="onItemShow"
                @item:new="onItemNew"
                @item:update="onItemUpdate"
                @item:delete="onItemDelete"
                @column:new="onColumnNew"
            >
                <template #column="{ column }">
                    <is-collection-column
                        :workspace-id="workspaceId"
                        :collection-id="collectionId"
                        :column="column"
                    />
                </template>
               
                <template
                    v-for="(c, index) in columns"
                    :key="index"
                    v-slot:[`item-${c.field}`]="{ item }"
                >
                    <is-collection-column-value
                        :workspace-id="workspaceId"
                        :collection-id="collectionId"
                        :column="c"
                        :item="item"
                    />
                </template>
        
            </component>
            
            <component v-else :is="c" :items="formattedItems" class="mt-5" />
        </template>
    </div>
</template>