<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import throttle from 'lodash/throttle'

import { CollectionColumn } from '@core/entities/collection'
import Item from '@core/entities/item'

import { useItemRepository } from '@/composables/item'
import { useBuilder } from 'vue-wind/composables/builder'
import { useCollectionItemsV2 } from '@/composables/collection'


const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    collectionId: {
        type: String,
        required: true,
    },
    column: {
        type: Object as () => CollectionColumn,
        required: true,
    },
    item: {
        type: Object as () => Item,
        required: true,
    },
})

const [relatedItems, setRelatedItems] = useCollectionItemsV2()

const crud = useItemRepository(props.workspaceId, props.collectionId)
const edit = ref(false)
const builder = useBuilder()
const payload = ref('')

if (props.column.type === 'relation') {
    setRelatedItems(props.workspaceId, props.column.collectionId)
}


const classes = computed(() => ({
    input: builder.make()
}))

function load(){
    payload.value = props.item[props.column.field]
}

builder
    .add('p-2 bg-transparent w-full h-[40px]')
    .add('hover:bg-gray-800')
    .add('focus:bg-gray-800 focus:outline focus:outline-2 focus:outline-teal-500')

const onChange = throttle(async () => {
    await crud.update(props.item.id, {
        [props.column.field]: payload.value
    })
}, 1000)

watch(() => props.item, load, {
    immediate: true,
    deep: true
})


</script>

<template>
    <input
        v-if="column.type === 'number'"
        v-model="payload"
        :class="classes.input"
        type="number"
        @change="onChange"
    >

    <template v-else-if="column.type === 'entry'">
        <input
            v-if="edit"
            v-model="payload"
            :class="classes.input"
            @blur="edit = false"
            @change="onChange"
        >

        <div
            v-else
            :class="classes.input"
            @click="edit = true"
        >
            <w-btn
                v-if="payload"
                size="sm"
                custom:color="bg-zinc-800"
                @click="$router.push(`/workspaces/${workspaceId}/entries/${payload}`)"
    
            >
                {{ payload }}
            </w-btn>
        </div>

    </template>

    
    <select
        v-else-if="column.type === 'select'"
        v-model="payload"
        :class="classes.input"
        @change="onChange"
    >
        <option value=""> - </option>
        
        <option v-for="o in column.options.split(',')" :value="o" :key="o">
            {{ o }}
        </option>
    </select>

    <select
        v-else-if="column.type === 'relation'"
        v-model="payload"
        :class="classes.input"
        @change="onChange"
    >
        <option value=""> - </option>
        
        <option v-for="item in relatedItems" :value="item.id" :key="item.id">
            {{ item[column.displayField] }}
        </option>
    </select>
    
    <input
        v-else
        v-model="payload"
        :class="classes.input"
        @change="onChange"
    >
</template>