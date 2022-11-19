<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import debounce from 'lodash/debounce'

import { createCollectionColumn, updateOrCreateCollectionView, useCollectionColumns, useCollectionItemsV2, useCollectionViews } from '@/composables/collection'
import { useItemRepository } from '@/composables/item'
import { useArray, ArrayFilter } from '@/composables/array'

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
        required: true,
    },
    title: {
        type: String,
        default: null
    }
})


const router = useRouter()
const drawer = ref(false)
const loading = ref(false)

const [columns, setColumns] = useCollectionColumns()
const [items, setItems] = useCollectionItemsV2()
const [views, setViews] = useCollectionViews()

const options = ref<Record<string, string | number>>({})

const filteredColumns = computed(() => columns.value.map(column => {
    return {
        ...column,
        width: options.value[`column:${column.id}:width`] || 100
    }
}))

const filteredItems = computed(() => {
    const filters = columns.value
        .filter(c => !!options.value[`filter:${c.field}`])
        .map<ArrayFilter>(c => ({
            type: c.type === 'relation' ? 'string' : c.type,
            key: c.field,
            value: options.value[`filter:${c.field}`]
        }))

    return useArray(items.value).filter(...filters).value()
})

const filters = computed(() => {
    const result = {}
    
    Object.keys(options.value)
        .filter(key => key.startsWith('filter:'))
        .forEach(key => {
            result[key.replace('filter:', '')] = options.value[key]
        })

    return result
})

const crud = useItemRepository(props.workspaceId, props.collectionId)

async function load(){
    loading.value = true

    await setViews(props.workspaceId, props.collectionId)
    await setColumns(props.workspaceId, props.collectionId)
    await setItems(props.workspaceId, props.collectionId)

    const view = views.value.find(v => v.id === props.viewId)

    if (!view) return

    Object.keys(view).forEach(key => {
        options.value[key] = view[key]
    })

    setTimeout(() => (loading.value = false), 800)
}

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

async function onItemDelete(item: any) {
    await crud.destroy(item.id)
}


async function onColumnNew(){
    await createCollectionColumn(props.workspaceId, props.collectionId)
}

const saveOptions = debounce( async () => {
    if (loading.value) return
    
    await updateOrCreateCollectionView(props.workspaceId, props.collectionId, props.viewId, options.value)
}, 1000)

function setFilters(value: any) {
    Object.keys(value).forEach(key => {
        options.value[`filter:${key}`] = value[key]
    })
}

watch(options, saveOptions, { deep: true })
watch(props, load, { immediate: true, deep: true })

</script>
<template>

    <is-collection-table-filters v-model="drawer" :columns="columns" :filters="filters" @submit="setFilters" />

    <div class="w-full my-4 flex items-center" >
        <div class="text-lg font-bold" v-if="title">
            {{ title }}
        </div>

        <div class="ml-auto">
            <is-btn @click="drawer = true">
                <is-icon name="filter" />                
            </is-btn>
        </div>
    </div>
    
    <is-table
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

                    <is-resize-line
                        :model-value="column.width"
                        @update:model-value="(value: number) => options[`column:${column.id}:width`] = value"
                        :min-width="100"
                    />
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
                <td v-for="(c, index) in filteredColumns" :key="index" :class="classes.td" class="relative">
                    
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
                        v-if="index === filteredColumns.length - 1"
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
                    :colspan="filteredColumns.length + 2"
                    class="p-2 cursor-pointer hover:bg-gray-800 text-gray-500 text-sm border-r-0"
                    @click="onItemNew"
                >
                    <fa-icon icon="plus" class="mr-2" />

                    <span>New</span>

                </td>
            </tr>
        </template>
        
    </is-table>
</template>