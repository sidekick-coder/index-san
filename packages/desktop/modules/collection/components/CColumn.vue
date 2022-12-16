<script setup lang="ts">
import { CollectionColumn, CollectionColumnType } from '@core/entities/collection'

import { computed, ref, watch } from 'vue'
import { useStore } from '@/modules/collection/store'

import MEditor from '@/modules/monaco/components/MEditor.vue'
import { useVModel } from '@vueuse/core'
import { useNonReactive } from '@/composables/utils'
import { useI18n } from 'vue-i18n'

// Props & emits
const props = defineProps({
    modelValue: {
        type: Object as () => CollectionColumn,
        required: true,
    },
    collectionId: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['update:modelValue'])

// form
const tm = useI18n()
const model = useVModel(props, 'modelValue', emit)

const payload = ref<CollectionColumn>({
    id: '',
    label: '',
    field: '',
    type: CollectionColumnType.text,
    content: '',
    options: undefined,
    collectionId: undefined,
    displayField: undefined,
})

const types = Object.values(CollectionColumnType).map((v) => ({
    label: tm.t(v),
    value: v,
}))

async function submit() {
    model.value = useNonReactive(payload.value)

    dialog.value = false
}

// icons
const icons: Record<CollectionColumn['type'], any> = {
    text: 'font',
    number: 'hashtag',
    select: 'fa-regular fa-square-caret-down',
    relation: 'arrow-up',
    script: 'code',
    entry: 'file',
}

// dialog
const dialog = ref(false)

watch(dialog, (value) => {
    if (!value) return

    payload.value = useNonReactive(model.value)
})

async function deleteColumn() {
    // await deleteCollectionColumn(props.workspaceId, props.collectionId, props.column.id)

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
    <v-dialog v-model="dialog">
        <template #activator="{ attrs }">
            <div
                class="cursor-pointer text-t-secondary text-sm flex items-center overflow-hidden"
                v-bind="{ ...attrs, ...$attrs }"
            >
                <fa-icon :icon="icons[model.type] || 'font'" class="mr-2 text-xs" />

                {{ model.label }}
            </div>
        </template>

        <v-card width="500" color="b-secondary">
            <v-card-head class="px-4">
                <v-card-title>
                    {{ $t('editEntity', [$t('column')]) }}
                </v-card-title>
                <v-btn text color="danger" class="ml-auto" @click="deleteColumn">
                    <is-icon name="trash" />
                </v-btn>
            </v-card-head>

            <v-card-content>
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

                    <div class="mb-4">
                        <is-input v-model="payload.field" label="Field" />
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

                    <is-drawer v-if="payload.type === 'script'" width="800">
                        <template #activator="{ attrs }">
                            <is-input
                                v-bind="attrs"
                                :model-value="$t('editEntity', [$t('script')])"
                                :label="$t('content')"
                                readonly
                                class="cursor-pointer mb-4"
                                input:class="cursor-pointer max-w-[calc(100%_-_32px)]"
                            >
                                <template #append>
                                    <is-icon name="code" class="ml-auto" />
                                </template>
                            </is-input>
                        </template>

                        <v-card color="b-secondary" class="h-full">
                            <m-editor v-model="payload.content" />
                        </v-card>
                    </is-drawer>

                    <div v-if="payload.type === 'entry'" class="mb-4">
                        <is-input
                            v-model="payload.filename"
                            :label="$t('filename')"
                            placeholder="thumbnail.jpg"
                        />
                    </div>

                    <div>
                        <v-btn type="submit" class="w-full">{{ $t('save') }}</v-btn>
                    </div>
                </w-form>
            </v-card-content>
        </v-card>
    </v-dialog>
</template>
