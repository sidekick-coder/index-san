<script lang="ts" setup>
import { ref, shallowRef, useSlots } from 'vue'

import { CollectionColumn } from '@core/entities/collection'
import Item from '@core/entities/item'

import { useItemRepository } from '@/composables/item'

import { useCollection } from '@/composables/collection'
import { useRouter } from 'vue-router'

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

const slots = useSlots()
const router = useRouter()

const crud = useItemRepository(props.workspaceId, props.collectionId)
const collection = useCollection(props.workspaceId, props.collectionId)

const items = ref<Item[]>([])
const components = shallowRef<any[]>([])

const columns = ref<CollectionColumn[]>([])

function setViews(){
    if (!slots.default) return

    const children = slots.default()

    children
        .filter(c => typeof c.type === 'object')
        .filter(c => ['IsTable'].includes((c.type as any).name))
        .forEach(child => {
            components.value.push(child)
        })

}

async function load(){
    if (!props.workspaceId || !props.collectionId) return
    
    const response = await collection.show()
    
    columns.value = response.columns

    await setItems()
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
    <div>
        <component
            v-for="(c, index) in components"
            :key="index"
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
    </div>
</template>