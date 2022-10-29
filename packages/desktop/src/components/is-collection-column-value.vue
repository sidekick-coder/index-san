<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import throttle from 'lodash/throttle'

import { CollectionColumn } from '@core/entities/collection'
import Item from '@core/entities/item'

import { useItemRepository } from '@/composables/item'
import { useBuilder } from 'vue-wind/composables/builder'


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

const crud = useItemRepository(props.workspaceId, props.collectionId)
const edit = ref(false)
const builder = useBuilder()
const payload = ref('')

const classes = computed(() => ({
    input: builder.make()
}))

function load(){
    payload.value = props.item[props.column.field]
}

builder
    .add('p-2 bg-transparent w-full')
    .add('hover:bg-gray-800')
    .add('focus:bg-gray-800 focus:outline focus:outline-2 focus:outline-teal-500')

const onChange = throttle(async () => {
    await crud.update(props.item.id, {
        [props.column.field]: payload.value
    })
}, 1000)

watch(props, load, {
    immediate: true,
    deep: true
})

watch(payload, onChange)

</script>

<template>
    <input
        v-if="column.type === 'number'"
        v-model="payload"
        :class="classes.input"
        type="number"
    >

    <template v-else-if="column.type === 'entry'">
        <input
            v-if="edit"
            v-model="payload"
            :class="classes.input"
            @blur="edit = false"
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
    >
        <option value=""> - </option>
        
        <option v-for="o in column.options.split(',')" :value="o" :key="o">
            {{ o }}
        </option>
    </select>
    
    <input
        v-else
        v-model="payload"
        :class="classes.input"
    >
</template>