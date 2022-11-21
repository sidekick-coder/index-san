<script lang="ts" setup>
import { computed, ref, shallowRef, useSlots, watch } from 'vue'
import { CollectionColumn } from '@core/entities/collection'

import { useChildren } from '@/composables/children'
import { onCollectionUpdate, useCollectionColumns, useCollectionItems } from '@/composables/collection'

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

const loading = ref(false)

const components = shallowRef<any[]>([])
const [columns, setColumns] = useCollectionColumns()
const [items, setItems] = useCollectionItems()

const formattedItems = computed(() => items.value.map(item => {
    const data: any = {}

    columns.value.forEach(column => {
        data[column.field] = item[column.field]

        if (column.type === 'relation') {
            // data[column.field] = column.options.get(item[column.field])
        }
    })

    return data
}))


function setComponents(){
    components.value = []

    children.load()

    children
        .findComponent('IsCollectionTable', 'IsChartBar')
        .forEach(c => components.value.push(c))
}


async function load(){
    if (!props.workspaceId || !props.collectionId) return

    
    loading.value = true    
    
    await setItems(props.workspaceId, props.collectionId)
    await setColumns(props.workspaceId, props.collectionId)

    setComponents()

    loading.value = false
}

watch(() => props, load, {
    immediate: true,
    deep: true
})

onCollectionUpdate(props.workspaceId, props.collectionId, load)

</script>
<template>
    <div v-if="!loading" class="flex flex-wrap relative group">
        <template v-for="(c, index) in components" :key="index">
            <is-collection-table
                v-if="c.type.name === 'IsCollectionTable'"
                :workspace-id="workspaceId"
                :collection-id="collectionId"
            />
            
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