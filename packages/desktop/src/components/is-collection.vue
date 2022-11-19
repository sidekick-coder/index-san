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
        column.name = column.id

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

    loading.value = true

    view.value = data

    setTimeout(() => (loading.value = false), 800)
    
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
        <!-- <div
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
        /> -->

        <template v-for="(c, index) in components" :key="index">
            <component
                v-if="c.type.name === 'IsTable' "
                :is="c"
                :items="filteredItems"
                :columns="filteredColumns"
                class="collection-table"
            >
                <template #column="{ classes, columns }">
                    <tr :class="classes.tr" class="relative">
                        <th
                            v-for="(column, index) in columns"
                            :key="column.name"
                            :class="classes.th"
                            :style="column.width ? `width: ${column.width}px` : '' "
                        >
                            
                            <is-collection-column
                                :workspace-id="workspaceId"
                                :collection-id="collectionId"
                                :column="column"
                            />
        
                            <is-icon
                                v-if="index === columns.length - 1"
                                class="absolute cursor-pointer -mr-[36px] w-[36px] text-gray-500 flex items-center justify-center h-full right-0 top-0"
                                name="plus"
                                @click="onColumnNew"
                            />
        
                            <is-resize-line v-model="column.width" :min-width="100" />
                        </th>
                        
                        <th v-if="!columns.length" :class="classes.th">
                            <div class="flex cursor-pointer" @click="onColumnNew">
                                Add column
                                <is-icon 
                                    class="cursor-pointer ml-2"
                                    name="plus"
                                    @click="onColumnNew"
                                />
                            </div>
                        </th>
                    </tr>
                </template>

                <template #item="{ item, classes }">

                    <tr :class="classes.tr" class="collection-table-item" >
                        <td v-for="(c, index) in columns" :key="index" :class="classes.td" class="relative">
                            
                            <is-icon
                                v-if="index === 0"
                                class="absolute text-gray-500 cursor-pointer w-[36px] -ml-[36px] flex items-center justify-center h-full top-0 actions"
                                @click="onItemShow(item)"
                                name="ellipsis-vertical"
                            />
                        
                            <is-collection-column-value
                                :workspace-id="workspaceId"
                                :collection-id="collectionId"
                                :column="c"
                                :item="item"
                            />

                            <i
                                class="absolute text-gray-500 cursor-pointer -mr-[36px] h-full flex items-center justify-center actions right-0 top-0"
                                v-if="index === columns.length - 1"
                                @click="onItemDelete(item)"
                            >
                                <fa-icon icon="trash" />
                            </i>    
                        
                        </td>
                    </tr>
                </template>

                <template #append-body="{ classes }">
                    <tr :class="classes.tr">
                        <td
                            :class="[classes.td]"
                            :colspan="columns.length + 2"
                            class="p-2 cursor-pointer hover:bg-gray-800 text-gray-500 text-sm border-r-0"
                            @click="onItemNew"
                        >
                            <fa-icon icon="plus" class="mr-2" />

                            <span>New</span>

                        </td>
                    </tr>
                </template>
               
              
            </component>
            
            <component v-else :is="c" :items="formattedItems" class="mt-5" />
        </template>
    </div>
</template>

<style lang="scss">
.collection-table {
    .collection-table-item {
        position: relative;
        .actions {
            opacity: 0;
        }
    
        &:hover {
            .actions {
                opacity: 1;
            }
        }
    }
}
</style>