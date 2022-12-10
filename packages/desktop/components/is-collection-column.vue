<script setup lang="ts">
import { CollectionColumn } from '@core/entities/collection'

import { updateCollectionColumn, deleteCollectionColumn } from '@/composables/collection'

import { computed, ref, watch } from 'vue'
import { useStore } from '@/modules/collection/store'

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
})

const types = [
    {
        label: 'Text',
        value: 'text',
    },
    {
        label: 'Number',
        value: 'number',
    },
    {
        label: 'Select',
        value: 'select',
    },
    {
        label: 'Entry',
        value: 'entry',
    },
    {
        label: 'Relation',
        value: 'relation',
    },
]

const dialog = ref(false)

const payload = ref({
    label: '',
    field: '',
    type: 'text',
    options: undefined,
    collectionId: undefined,
    displayField: undefined,
})

const icons = {
    text: 'font',
    number: 'hashtag',
    select: 'fa-regular fa-square-caret-down',
    relation: 'arrow-up',
}

function load() {
    Object.keys(payload.value).forEach((key) => {
        payload.value[key] = props.column[key]
    })
}

watch(() => props.column, load, { immediate: true, deep: true })

async function submit() {
    if (payload.value.type !== 'select') {
        payload.value.options = undefined
    }

    await updateCollectionColumn(
        props.workspaceId,
        props.collectionId,
        props.column.id,
        payload.value
    )

    dialog.value = false
}

async function deleteColumn() {
    await deleteCollectionColumn(props.workspaceId, props.collectionId, props.column.id)

    dialog.value = false
}

// collections
const store = useStore()

// selected collection options

const options = computed(() => {
    const { collectionId } = payload.value

    if (!collectionId) return []

    const collection = store.collections.find((c) => c.id === collectionId)

    if (!collection) return []

    return collection.columns
})
</script>
<template>
    <is-dialog v-model="dialog">
        <template #activator="{ on }">
            <div class="cursor-pointer text-t-secondary text-sm" v-bind="on">
                <fa-icon :icon="icons[column.type] || 'font'" class="mr-1 text-xs" />

                {{ column.label }}
            </div>
        </template>

        <is-card width="500" color="b-secondary">
            <is-card-head>
                <is-card-title>
                    {{ $t('editEntity', [$t('column')]) }}
                </is-card-title>
                <is-btn text color="danger" class="ml-auto" @click="deleteColumn">
                    <is-icon name="trash" />
                </is-btn>
            </is-card-head>

            <is-card-content>
                <w-form class="w-full" @submit="submit">
                    <div class="mb-4">
                        <is-input v-model="payload.label" label="Label" />
                    </div>

                    <div class="mb-4">
                        <is-select
                            v-model="payload.type"
                            label="Type"
                            :options="types"
                            label-key="label"
                            value-key="value"
                            card:color="b-primary"
                        />
                    </div>

                    <div v-if="payload.type === 'select'" class="mb-4">
                        <is-input
                            v-model="payload.options"
                            label="Options (separate by comma)"
                            placeholder="item-01,item-02"
                        />
                    </div>

                    <template v-if="payload.type === 'relation'">
                        <div class="mb-4">
                            <is-select
                                v-model="payload.collectionId"
                                label="Collection"
                                :options="store.collections"
                                label-key="name"
                                value-key="id"
                                card:color="b-primary"
                            />
                        </div>

                        <div v-if="payload.collectionId" class="mb-4">
                            <is-select
                                v-model="payload.displayField"
                                label="Collection display field"
                                :options="options"
                                label-key="label"
                                value-key="field"
                                card:color="b-primary"
                            />
                        </div>
                    </template>

                    <div class="mb-4">
                        <is-input v-model="payload.field" label="Field" />
                    </div>

                    <div>
                        <is-btn class="w-full">Submit</is-btn>
                    </div>
                </w-form>
            </is-card-content>
        </is-card>
    </is-dialog>
</template>
