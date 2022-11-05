<script lang="ts" setup>
import { computed, ref, shallowRef, useSlots } from 'vue'

import { CollectionColumn } from '@core/entities/collection'
import Item from '@core/entities/item'

import { useItemRepository } from '@/composables/item'

import { useCollection, useCollectionItemsAsync } from '@/composables/collection'
import { useRouter } from 'vue-router'
import { useChildren } from '@/composables/children'

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

const crud = useItemRepository(props.workspaceId, props.collectionId)
const collection = useCollection(props.workspaceId, props.collectionId)

const loading = ref(false)
const items = ref<Item[]>([])
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
    children.load()

    children.findComponent('IsTable', 'IsChartBar').forEach(c => {
        components.value.push(c)
    })

}

async function load(){
    if (!props.workspaceId || !props.collectionId) return

    loading.value = true
    
    await setColumns()   

    await setItems()

    loading.value = false
}

async function setColumns(){
    const response = await collection.show()
    
    for await (const column of response.columns) {
        if (column.type === 'relation') {
            const relation = await useCollectionItemsAsync(props.workspaceId, column.collectionId)

            column.options = new Map<string, string>()
            
            relation.value.forEach(i => column.options.set(i.id, i[column.displayField]))
        }
    }

    columns.value = response.columns
}

async function setItems(){
    await crud.list().then(d => items.value = d.data)
}

setViews()

load()

collection.on('update', load)

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
    await collection.addColumn()
}

</script>
<template>
    <div v-if="!loading">
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
               
                <template #item="{ column, item }">
                    <is-collection-column-value
                        :workspace-id="workspaceId"
                        :collection-id="collectionId"
                        :column="column"
                        :item="item"
                    />
                </template>
        
            </component>
            
            <component v-else :is="c" :items="formattedItems" />
        </template>
    </div>
</template>