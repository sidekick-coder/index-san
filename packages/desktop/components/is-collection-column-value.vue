<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import throttle from 'lodash/throttle'

import { CollectionColumn } from '@core/entities/collection'
import Item from '@core/entities/item'

import { updateItem } from '@/composables/item'
import { useBuilder } from 'vue-wind/composables/builder'
import { useCollectionItems } from '@/composables/collection'

import SOutput from '@/modules/script/components/SOutput.vue'

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
const payload = ref<any>()

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

// get script label

const scriptLabel = computed(() => {
    if (props.column.type !== 'script') return null

    if (!payload.value) return null

    if (payload.value.result) return payload.value.result

    if (payload.value.error) return payload.value.error.message

    return null
})

// get select options

const select = ref({
    options: computed(() => {
        if (props.column.type !== 'select') return []

        return props.column.options.split(',').map((o) => o.trim())
    }),
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

    <is-select
        v-else-if="column.type === 'select'"
        v-model="payload"
        :class="classes.input"
        :options="select.options"
        flat
        @update:model-value="onChange"
    />

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

    <is-dialog v-else-if="column.type === 'script'">
        <template #activator="{ attrs }">
            <is-input
                v-bind="attrs"
                :model-value="scriptLabel"
                readonly
                flat
                input:class="cursor-pointer max-w-[calc(100%_-_32px)]"
            />
        </template>

        <v-card width="500" height="500" color="b-secondary">
            <is-card-head>
                {{ $t('output') }}
            </is-card-head>

            <s-output :output="payload" />
        </v-card>
    </is-dialog>

    <is-input v-else v-model="payload" flat @change="onChange" />
</template>
