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

const filteredColumns = computed(() => columns.value.filter(c => {
    if (view.value.hiddenColumns) {
        return !view.value.hiddenColumns.includes(c.id)
    }

    return true
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

    const collectionColumns = collection.value?.columns.slice() ?? []
    
    for await (const column of collectionColumns) {
        column.name = column.field

        if (column.type === 'relation') {
            const relation = await useCollectionItemsAsync(props.workspaceId, column.collectionId)

            column.options = new Map<string, string>()
            
            relation.value.forEach(i => column.options.set(i.id, i[column.displayField]))
        }
    }

    columns.value = collectionColumns
}

async function setItems(filters?: any){
    if (filters) {
        view.value.filters = filters
    }

    await useCollectionItemsAsync(props.workspaceId, props.collectionId)
}

async function updateView(data: any)  {
    view.value = data
    
    if (!props.viewId) return

    await updateOrCreateCollectionView(
        props.workspaceId,
        props.collectionId,
        props.viewId,
        view.value
    )
}

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
    <div v-if="!loading" class="flex flex-wrap relative group">
        <div
            @click="drawer = !drawer"
            class="absolute -ml-[36px] h-[36px] w-[36px] flex items-center justify-center left-0 top-0 opacity-x0 group-hover:opacity-100 cursor-pointer"
        >
            <is-icon name="ellipsis-vertical" class="cursor-pointer text-gray-500" />
        </div>

        <is-collection-drawer
            v-model="drawer"
            :columns="columns"
            :view="view"
            @submit="updateView"
        />

        <template v-for="(c, index) in components" :key="index">
            <component
                v-if="c.type.name === 'IsTable' "
                :is="c"
                :items="filteredItems"
                :columns="filteredColumns"
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