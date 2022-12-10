<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import throttle from 'lodash/throttle'

import { CollectionColumn } from '@core/entities/collection'
import Item from '@core/entities/item'

import { updateItem } from '@/composables/item'
import { useBuilder } from 'vue-wind/composables/builder'
import { useCollectionItems } from '@/composables/collection'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    collectionId: {
        type: String,
        required: true,
    },
    itemId: {
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

const [relatedItems, setRelatedItems] = useCollectionItems()

const edit = ref(false)
const builder = useBuilder()
const payload = ref('')

if (props.column.type === 'relation') {
    setRelatedItems(props.workspaceId, props.column.collectionId)
}

const classes = computed(() => ({
    input: builder.make(),
}))

function load() {
    payload.value = props.item[props.column.field]
}

builder
    .add('p-2 bg-transparent w-full h-[40px]')
    .add('hover:bg-b-secondary')
    .add('focus:bg-b-secondary focus:outline focus:outline-2 focus:outline-accent')

const onChange = throttle(async () => {
    await updateItem(props.workspaceId, props.collectionId, props.itemId, {
        [props.column.field]: payload.value,
    })
}, 1000)

watch(() => props.item, load, {
    immediate: true,
    deep: true,
})
</script>

<template>
    <input
        v-if="column.type === 'number'"
        v-model="payload"
        :class="classes.input"
        type="number"
        @change="onChange"
    />

    <template v-else-if="column.type === 'entry'">
        <input
            v-if="edit"
            v-model="payload"
            :class="classes.input"
            @blur="edit = false"
            @change="onChange"
        />

        <div v-else :class="classes.input" @click="edit = true">
            <w-btn
                v-if="payload"
                size="sm"
                custom:color="bg-b-primary"
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
        <option value="">-</option>

        <option v-for="o in column.options.split(',')" :key="o" :value="o">
            {{ o }}
        </option>
    </select>

    <is-select
        v-else-if="column.type === 'relation'"
        v-model="payload"
        :class="classes.input"
        :label-key="column.displayField"
        :options="relatedItems"
        return-object
        value-key="id"
        flat
        @change="onChange"
    >
        <option value="">-</option>

        <option v-for="related in relatedItems" :key="related.id" :value="related.id">
            {{ related[column.displayField] }}
        </option>
    </is-select>

    <input v-else v-model="payload" :class="classes.input" @change="onChange" />
</template>
