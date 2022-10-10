<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import get from 'lodash/get'

import Collection from '@core/entities/collection'
import { CollectionFolderItem, useItemRepository } from '@/composables/item'
import { useCollectionRepository } from '@/composables/collection'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true
    },
    collectionId: {
        type: String,
        required: true
    },
    itemId: {
        type: String,
        default: null
    },
})

const emit = defineEmits(['save'])

const collectionRepository = useCollectionRepository(props.workspaceId)
const itemRepository = useItemRepository(props.workspaceId, props.collectionId)

const collection = ref<Collection>()
const item = ref<CollectionFolderItem>()
const payload = ref({})

const columns = computed<Collection['columns']>(() => collection.value?.columns || [])

async function loadItem(){
    if (props.itemId) {
        await itemRepository.show(props.itemId).then(i => (item.value = i))
    }

    columns.value.forEach(c => {
        payload.value[c.field] = get(item, `value.${c.field}`,  undefined)
    })
}

async function load(){
    await collectionRepository.show(props.collectionId).then(r => (collection.value = r.data))

    if (props.itemId) {
        await loadItem()
    }
}

watch(props, load, { deep: true, immediate: true })

async function save(){
    const data = payload.value
    
    await itemRepository.update(props.itemId, data)

    emit('save')    
}


</script>
<template>
    <div v-for="column in columns" :key="column.id" class="mb-4 last:mb-0" >
        <w-input
            v-model="payload[column.field]"
            :label="column.label"
            @change="save"
        />
    </div>
</template>