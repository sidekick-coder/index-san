<script setup lang="ts">
import { computed, ref, watch, defineAsyncComponent } from 'vue'

import Column, { ColumnType } from '@core/entities/column'

import { useStore as useCollectionStore } from '@/modules/collection/store'
import { useStore } from '@/store/global'

import { useNonReactive } from '@/composables/utils'
import { useI18n } from 'vue-i18n'

import { lib as libScriptColumn } from '@/modules/monaco/libs/column-script'

const MEditor = defineAsyncComponent(() => import('@/modules/monaco/components/MEditor.vue'))

// Props & emits
const props = defineProps({
    collectionId: {
        type: String,
        required: true,
    },
    columnId: {
        type: String,
        required: true,
    },
})

// column
const store = useStore()

const column = computed(() => store.column.get(props.collectionId, props.columnId))

const loading = ref(false)

async function setColumn() {
    loading.value = true

    await store.column
        .set(props.collectionId)
        .finally(() => setTimeout(() => (loading.value = false), 500))
}

watch(props, setColumn, { deep: true, immediate: true })

// form
const tm = useI18n()

const payload = ref<Column>({
    id: '',
    label: '',
    field: '',
    type: ColumnType.text,
    content: '',
    options: [],
    collectionId: undefined,
    displayField: undefined,
})

const types = Object.values(ColumnType).map((v) => ({
    label: tm.t(v),
    value: v,
}))

async function submit() {
    if (!column.value) return

    Object.keys(payload.value).forEach((key) => {
        column.value![key] = payload.value[key]
    })

    if (payload.value.type === ColumnType.createdAt) {
        column.value.field = '_createdAt'
    }

    if (payload.value.type === ColumnType.updatedAt) {
        column.value.field = '_updatedAt'
    }

    dialog.value = false
}

// icons
const icons: Record<Column['type'], any> = {
    text: 'font',
    number: 'hashtag',
    select: 'fa-regular fa-square-caret-down',
    relation: 'arrow-up',
    script: 'code',
    entry: 'file',
    createdAt: 'fa-regular fa-calendar',
    updatedAt: 'fa-regular fa-calendar',
    link: 'link',
    date: 'fa-regular fa-calendar',
    checkbox: 'fa-regular fa-square-check',
}

// dialog
const dialog = ref(false)

watch(dialog, (value) => {
    if (!value) return

    if (column.value) {
        payload.value = useNonReactive(column.value)

        payload.value.options = useNonReactive(column.value).options || []
    }
})

async function deleteColumn() {
    await store.column.destroy(props.collectionId, props.columnId)

    dialog.value = false
}

// collections
const collectionStore = useCollectionStore()

// relation selected collection options

const relation = computed(() => {
    const { collectionId } = payload.value

    if (!collectionId) return null

    const collection = collectionStore.collections.find((c) => c.id === collectionId)

    if (!collection) return null

    return collection
})
</script>
<template>
    <div
        v-if="loading"
        class="text-t-secondary text-sm overflow-hidden animate-pulse"
        v-bind="$attrs"
    >
        {{ $t('loading') }}...
    </div>

    <div v-else-if="!column" class="text-t-secondary text-sm overflow-hidden" v-bind="$attrs">
        <v-icon name="triangle-exclamation" class="mr-2 text-xs" />
        {{ $t('errors.unknown') }}
    </div>

    <v-dialog v-else v-model="dialog">
        <template #activator="{ attrs }">
            <div
                class="cursor-pointer text-t-secondary flex items-center overflow-hidden"
                v-bind="{ ...attrs, ...$attrs }"
            >
                <v-icon :name="icons[column.type] || 'font'" class="mr-3" />

                <div class="text-sm">
                    {{ column.label }}
                </div>
            </div>
        </template>

        <v-card width="500" color="b-secondary">
            <v-card-head class="px-4">
                <v-card-title>
                    {{ $t('editEntity', [$t('column')]) }}
                </v-card-title>
                <v-btn text color="danger" class="ml-auto" @click="deleteColumn">
                    <v-icon name="trash" />
                </v-btn>
            </v-card-head>

            <v-card-content>
                <w-form class="w-full" @submit="submit">
                    <div class="mb-4">
                        <v-input v-model="payload.label" label="Label" />
                    </div>

                    <div class="mb-4">
                        <v-select
                            v-model="payload.type"
                            label="Type"
                            :options="types"
                            label-key="label"
                            value-key="value"
                            card:color="b-primary"
                            menu:offset-y
                        />
                    </div>

                    <div
                        v-if="![ColumnType.createdAt, ColumnType.updatedAt].includes(payload.type)"
                        class="mb-4"
                    >
                        <v-input v-model="payload.field" label="Field" />
                    </div>

                    <template v-if="payload.type === 'select'">
                        <div class="text-t-secondary font-bold mb-2">{{ $t('option', 2) }}</div>

                        <div
                            v-for="(option, index) in payload.options"
                            :key="option"
                            class="flex items-center mb-4 last:mb-0"
                        >
                            <v-menu offset-x :close-on-content-click="true">
                                <template #activator="{ attrs }">
                                    <v-btn
                                        v-bind="attrs"
                                        :color="option.color || 'accent'"
                                        size="w-4 h-4"
                                    />

                                    <v-input v-model="option.name" class="ml-4">
                                        <template #append>
                                            <v-btn
                                                color="b-primary"
                                                size="sm"
                                                @click="payload.options.splice(index, 1)"
                                            >
                                                <v-icon name="times" />
                                            </v-btn>
                                        </template>
                                    </v-input>
                                </template>

                                <v-card class="py-4 px-2" color="b-primary">
                                    <v-btn
                                        color="accent"
                                        size="w-4 h-4"
                                        class="mb-4"
                                        @click="option.color = 'accent'"
                                    />
                                    <v-btn
                                        color="info"
                                        size="w-4 h-4"
                                        class="mb-4"
                                        @click="option.color = 'info'"
                                    />
                                    <v-btn
                                        color="danger"
                                        size="w-4 h-4"
                                        class="mb-4"
                                        @click="option.color = 'danger'"
                                    />
                                    <v-btn
                                        color="warn"
                                        size="w-4 h-4"
                                        class="mb-4"
                                        @click="option.color = 'warn'"
                                    />
                                </v-card>
                            </v-menu>
                        </div>
                        <v-list-item class="-mx-4">
                            <v-btn color="b-primary" size="sm" @click="payload.options.push({})">
                                <v-icon name="plus" />
                            </v-btn>
                        </v-list-item>
                    </template>

                    <template v-if="payload.type === ColumnType.relation">
                        <div class="mb-4">
                            <v-select
                                v-model="payload.collectionId"
                                label="Collection"
                                :options="collectionStore.collections"
                                label-key="name"
                                value-key="id"
                                card:color="b-primary"
                            />
                        </div>

                        <div v-if="payload.collectionId" class="mb-4">
                            <v-select
                                v-model="payload.displayField"
                                label="Collection display field"
                                :options="relation ? relation.columns : []"
                                label-key="label"
                                value-key="field"
                                card:color="b-primary"
                            />
                        </div>
                    </template>

                    <v-drawer v-if="payload.type === ColumnType.script" width="800">
                        <template #activator="{ attrs }">
                            <v-input
                                v-bind="attrs"
                                :model-value="$t('editEntity', [$t('script')])"
                                :label="$t('content')"
                                readonly
                                class="cursor-pointer mb-4"
                                input:class="cursor-pointer max-w-[calc(100%_-_32px)]"
                            >
                                <template #append>
                                    <v-icon name="code" class="ml-auto" />
                                </template>
                            </v-input>
                        </template>

                        <v-card color="b-secondary" class="h-full">
                            <m-editor
                                v-model="payload.content"
                                :libs="libScriptColumn.mount(store.column.all(collectionId))"
                            />
                        </v-card>
                    </v-drawer>

                    <div v-if="payload.type === ColumnType.entry" class="mb-4">
                        <v-input
                            v-model="payload.filename"
                            :label="$t('filename')"
                            placeholder="thumbnail.jpg"
                        />
                    </div>

                    <template v-if="payload.type === ColumnType.date">
                        <div class="mb-4">
                            <v-input
                                v-model="payload.displayFormat"
                                :label="$t('displayFormat')"
                                placeholder="YYYY-MM-DD"
                            />
                        </div>
                        <div class="mb-4">
                            <v-input
                                v-model="payload.saveFormat"
                                :label="$t('saveFormat')"
                                placeholder="YYYY-MM-DD"
                            />
                        </div>
                    </template>

                    <div>
                        <v-btn type="submit" class="w-full">{{ $t('save') }}</v-btn>
                    </div>
                </w-form>
            </v-card-content>
        </v-card>
    </v-dialog>
</template>
