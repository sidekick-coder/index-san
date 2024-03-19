<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import VDraggable from 'vuedraggable'
import { useStore } from '@store/global'
import ViewCommon from '@index-san/core/entities/view-common'
import { useView } from '@modules/view/composables/use-view'
import { convertToViewColumns, mergeWithViewColumns } from '@modules/view/composables'

const props = defineProps({
    collectionId: {
        type: String,
        required: true,
    },
    viewId: {
        type: String,
        required: true,
    },
})

const drawer = ref(false)

// view

let view = useView<ViewCommon>(props.collectionId, props.viewId, new ViewCommon({}, props.viewId))

function setView() {
    view = useView<ViewCommon>(props.collectionId, props.viewId, new ViewCommon({}, props.viewId))
}

watch([() => props.viewId, () => props.collectionId], setView, { immediate: true })
// columns
const store = useStore()

const collection = store.collection.get(props.collectionId)

const columns = computed({
    get() {
        return mergeWithViewColumns(collection?.columns || [], view.value?.columns)
    },
    set(value) {
        view.value = {
            ...view.value,
            columns: convertToViewColumns(value),
        }
    },
})

// actions

async function toggle(id: string) {
    columns.value = columns.value.map((c) => {
        if (c.id === id) {
            c.hide = !c.hide
        }

        return c
    })
}

async function showAll() {
    columns.value = columns.value.map((c) => {
        c.hide = false

        return c
    })
}

async function hideAll() {
    columns.value = columns.value.map((c) => {
        c.hide = true

        return c
    })
}
</script>

<template>
    <v-drawer v-model="drawer">
        <template #activator="{ attrs }">
            <v-btn
                mode="text"
                size="sm"
                v-bind="attrs"
                class="relative group/btn"
            >
                <v-icon name="columns" />
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

            <v-btn
                color="info"
                mode="text"
                size="sm"
                @click="hideAll"
            >
                {{ $t('hideAll') }}
            </v-btn>

            <v-btn
                color="info"
                mode="text"
                size="sm"
                @click="showAll"
            >
                {{ $t('showAll') }}
            </v-btn>

            <v-btn
                color="danger"
                mode="text"
                size="sm"
                @click="drawer = false"
            >
                <v-icon name="times" />
            </v-btn>
        </v-card-head>

        <v-draggable
            v-model="columns"
            item-key="id"
            handle=".drag"
        >
            <template #item="{ element: column }">
                <v-list-item class="hover:bg-b-secondary">
                    <v-btn
                        class="drag mr-2"
                        size="sm"
                        mode="text"
                    >
                        <v-icon name="grip-vertical" />
                    </v-btn>

                    <v-btn
                        class="drag mr-2"
                        size="sm"
                        mode="text"
                        @click="toggle(column.id)"
                    >
                        <v-icon :name="column.hide ? 'eye-slash' : 'eye'" />
                    </v-btn>

                    <div>
                        {{ column.label }}
                    </div>
                </v-list-item>
            </template>
        </v-draggable>
    </v-drawer>
</template>
