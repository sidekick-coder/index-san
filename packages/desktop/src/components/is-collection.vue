<script lang="ts" setup>
import { computed, ref, shallowRef, useSlots, watch } from 'vue'
import { useRouter } from 'vue-router'

import { CollectionColumn } from '@core/entities/collection'
import Item from '@core/entities/item'

import { useItemRepository } from '@/composables/item'

import { useChildren } from '@/composables/children'
import { useArray } from '@/composables/array'
import {
    useCollection,
    useCollectionAsync,
    useCollectionItemsAsync,
    onCollectionUpdate,
    useCollectionItems,
    createCollectionColumn,
    useCollectionView,
    updateOrCreateCollectionView
} from '@/composables/collection'
import { debounce } from 'lodash'
import { vi } from 'vitest'


const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    collectionId: {
        type: String,
        required: true,
    },
    viewId: {
        type: String,
        default: null
    }
})

const children = useChildren(useSlots())
const router = useRouter()

const crud = useItemRepository(props.workspaceId, props.collectionId)

const loading = ref(false)
const drawer = ref(false)
const columns = ref<CollectionColumn[]>([])

const components = shallowRef<any[]>([])
const collection = computed(() => useCollection(props.workspaceId, props.collectionId).value)
const items = computed(() => useCollectionItems(props.workspaceId, props.collectionId).value)

const [view, setView] = useCollectionView()

const filteredItems = computed<Item[]>(() => {

    if (!view.value.filters) return items.value

    const params = columns.value
        .filter(c => !!view.value.filters[c.field])
        .map(c => ({
            type: c.type === 'relation' ? 'string' : c.type,
            key: c.field,
            value: view.value.filters[c.field]
        }))

    return useArray(items.value).filter(...params).value()
})

const formattedItems = computed(() => filteredItems.value.map(item => {
    const data: any = {}

    columns.value.forEach(column => {
        data[column.field] = item[column.field]

        if (column.type === 'relation') {
            data[column.field] = column.options.get(item[column.field])
        }
    })

    return data
}))

function setComponents(){
    components.value = []

    children.load()

    children
        .findComponent('IsTable', 'IsChartBar')
        .forEach(c => components.value.push(c))

}


async function setColumns(){
    await useCollectionAsync(props.workspaceId, props.collectionId, true)

    columns.value = collection.value?.columns.slice() ?? []
    
    for await (const column of columns.value) {
        column.name = column.field

        if (column.type === 'relation') {
            const relation = await useCollectionItemsAsync(props.workspaceId, column.collectionId)

            column.options = new Map<string, string>()
            
            relation.value.forEach(i => column.options.set(i.id, i[column.displayField]))
        }
    }
}

async function setItems(filters?: any){
    if (filters) {
        view.value.filters = filters
    }

    await useCollectionItemsAsync(props.workspaceId, props.collectionId)
}

const updateView = debounce(async () => {
    if (!props.viewId) return

    await updateOrCreateCollectionView(
        props.workspaceId,
        props.collectionId,
        props.viewId,
        view.value
    )
}, 3000)

async function load(){
    if (!props.workspaceId || !props.collectionId) return
    
    loading.value = true    

    await setView(props.workspaceId, props.collectionId, props.viewId)
    
    await setColumns()   
    
    setComponents()

    await setItems()

    loading.value = false

}

watch(() => props, load, {
    immediate: true,
    deep: true
})

watch(() => view, updateView, {
    deep: true
})

onCollectionUpdate(props.workspaceId, props.collectionId, load)


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
    await createCollectionColumn(props.workspaceId, props.collectionId)
}

</script>
<template>
    <div v-if="!loading" class="flex flex-wrap">
        <div class="border-b py-2 border-gray-700 w-full">
            <is-icon name="filter" class="cursor-pointer text-gray-500" @click="drawer = !drawer"  />
        </div>

        <is-collection-drawer
            v-model="drawer"
            :columns="columns"
            :initialFilters="view.filters"
            @submit="setItems"
        />

        <template v-for="(c, index) in components" :key="index">
            <component
                v-if="c.type.name === 'IsTable' "
                :is="c"
                :items="filteredItems"
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