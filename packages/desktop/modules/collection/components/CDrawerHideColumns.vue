<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVModel } from '@vueuse/core'

import View, { ViewColumn } from '@/../core/entities/view'

import VDraggable from 'vuedraggable'
import { useStore } from '../store'

const props = defineProps({
    modelValue: {
        type: Array as () => View['columns'],
        default: () => [],
    },
    collectionId: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['update:modelValue'])

const columns = useVModel(props, 'modelValue', emit)

const drawer = ref(false)

function showAll() {
    columns.value.forEach((c) => {
        c.hide = false
    })
}

function hideAll() {
    columns.value.forEach((c) => {
        c.hide = true
    })
}

// get label
const store = useStore()

const collection = computed(() => store.collections.find((c) => c.id === props.collectionId))

function getLabel(viewColumn: ViewColumn) {
    const column = collection.value?.columns.find((c) => c.id === viewColumn.id)

    return column?.label || viewColumn.id
}
</script>

<template>
    <is-drawer v-model="drawer">
        <template #activator="{ attrs }">
            <v-btn text size="sm" v-bind="attrs" class="relative group/btn">
                <is-icon name="columns" />
                <div
                    v-if="columns.some((c) => c.hide)"
                    class="bg-accent h-2 w-2 rounded-full absolute top-0 right-0 group-hover/btn:text-t-primary"
                />
            </v-btn>
        </template>

        <v-card-head class="px-4">
            <v-card-title class="text-t-secondary mr-auto">
                {{ $t('column', 2) }}
            </v-card-title>

            <v-btn color="info" text @click="hideAll">
                {{ $t('hideAll') }}
            </v-btn>

            <v-btn color="info" text @click="showAll">
                {{ $t('showAll') }}
            </v-btn>

            <v-btn color="danger" text @click="drawer = false">
                <is-icon name="times" />
            </v-btn>
        </v-card-head>

        <v-draggable v-model="columns" item-key="id" handle=".drag">
            <template #item="{ element: column }">
                <is-list-item class="hover:bg-b-secondary">
                    <v-btn class="drag mr-2" size="sm" text>
                        <is-icon name="grip-vertical" />
                    </v-btn>

                    <v-btn class="drag mr-2" size="sm" text @click="column.hide = !column.hide">
                        <is-icon :name="column.hide ? 'eye-slash' : 'eye'" />
                    </v-btn>

                    <div>
                        {{ getLabel(column) }}
                    </div>
                </is-list-item>
            </template>
        </v-draggable>
    </is-drawer>
</template>
