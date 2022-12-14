<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import throttle from 'lodash/throttle'

import { CollectionColumn } from '@core/entities/collection'
import Item from '@core/entities/item'

import SOutput from '@/modules/script/components/SOutput.vue'
import { useVModel } from 'vue-wind/composables/v-model'
import ExecuteScriptDTO from '@/../core/use-cases/execute-script/execute-script.dto'
import { useStore } from '../store'

const props = defineProps({
    modelValue: {
        type: [String, Number, Object],
        default: null,
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

const emit = defineEmits(['update:modelValue'])

// set value
const model = useVModel(props, 'modelValue', emit)

// if (props.column.type === 'relation') {
//     setRelatedItems(props.workspaceId, props.column.collectionId)
// }

const onChange = throttle(async () => {
    // await updateItem(props.workspaceId, props.collectionId, props.itemId, {
    //     [props.column.field]: payload.value,
    // })
}, 1000)

// Select options

const select = ref({
    options: computed(() => {
        if (props.column.type !== 'select') return []

        return props.column.options.split(',').map((o: string) => o.trim())
    }),
})

// Script options

const scriptLabel = computed(() => {
    if (props.column.type !== 'script') return null

    if (!model.value) return null

    if (typeof model.value !== 'object') return null

    if (model.value.result) return model.value.result

    if (model.value.error) return model.value.error.message

    return null
})

const scriptOutput = computed(() => {
    if (props.column.type !== 'script') return null

    if (!model.value) return null

    if (typeof model.value !== 'object') return null

    return model.value as ExecuteScriptDTO.Output
})

// relation options

const store = useStore()

const relation = ref({
    items: [] as Item[],
})

async function setRelation() {
    if (props.column.type !== 'relation') {
        relation.value.items = []
        return
    }

    await store
        .list({
            collectionId: props.column.collectionId,
        })
        .then((r) => (relation.value.items = r.data))
        .catch(() => (relation.value.items = []))
}

watch(() => props.column, setRelation, {
    immediate: true,
})
</script>

<template>
    <is-input
        v-if="column.type === 'number'"
        v-model="model"
        flat
        type="number"
        @change="onChange"
    />

    <is-select
        v-else-if="column.type === 'select'"
        v-model="model"
        :options="select.options"
        flat
        @update:model-value="onChange"
    />

    <v-dialog v-else-if="column.type === 'script'">
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
            <v-card-head>
                {{ $t('output') }}
            </v-card-head>

            <s-output :output="scriptOutput" />
        </v-card>
    </v-dialog>

    <is-select
        v-else-if="column.type === 'relation'"
        v-model="model"
        :label-key="column.displayField"
        :options="relation.items"
        return-object
        value-key="id"
        flat
    />

    <!-- <template v-else-if="column.type === 'entry'">
        <input
            v-if="edit"
            v-model="payload"
            
            @blur="edit = false"
            @change="onChange"
        />

        <div v-else  @click="edit = true">
            <w-btn
                v-if="payload"
                size="sm"
                custom:color="bg-b-primary"
                @click="$router.push(`/workspaces/${workspaceId}/entries/${payload}`)"
            >
                {{ payload }}
            </w-btn>
        </div>
    </template> -->

    <is-input v-else v-model="model" flat @change="onChange" />
</template>
