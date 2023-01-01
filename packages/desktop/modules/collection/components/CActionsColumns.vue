<script setup lang="ts">
import { computed, onUnmounted, onMounted, ref, watch } from 'vue'

import VDraggable from 'vuedraggable'
import { useStore } from '@/store/global'
import { withView, withOnlyView } from '@/modules/collection-column/composables/with-view'
import { waitFor } from '@/composables/utils'
import ViewCommon from '@/../core/entities/view-common'
import { useView } from '@/modules/view/composables/use-view'

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

// columns
const store = useStore()

const collection = store.collection.get(props.collectionId)

// view

const { view, state, save } = useView<ViewCommon>({
    collectionId: props.collectionId,
    viewId: props.viewId,
    defaultValue: new ViewCommon({}, props.viewId),
})

const columns = ref<any[]>([])

async function setColumns() {
    columns.value = withView(collection?.columns || [], view.value?.columns)
}

watch(view, setColumns)

// actions

async function saveView() {
    view.value.columns = withOnlyView(columns.value)

    await save()
}

async function toggle(id: string) {
    const column = columns.value.find((c) => c.id === id)

    if (column) {
        column.hide = !column.hide
    }

    await saveView()
}

async function showAll() {
    columns.value = columns.value.map((c) => {
        c.hide = false

        return c
    })

    await saveView()
}

async function hideAll() {
    columns.value = columns.value.map((c) => {
        c.hide = true

        return c
    })

    await saveView()
}
</script>

<template>
    <v-drawer v-model="drawer">
        <template #activator="{ attrs }">
            <v-btn text size="sm" v-bind="attrs" class="relative group/btn">
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

            <v-btn color="info" text @click="hideAll">
                {{ $t('hideAll') }}
            </v-btn>

            <v-btn color="info" text @click="showAll">
                {{ $t('showAll') }}
            </v-btn>

            <v-btn color="danger" text @click="drawer = false">
                <v-icon name="times" />
            </v-btn>
        </v-card-head>

        <v-draggable v-model="columns" item-key="id" handle=".drag" @update="saveView">
            <template #item="{ element: column }">
                <v-list-item class="hover:bg-b-secondary">
                    <v-btn class="drag mr-2" size="sm" text>
                        <v-icon name="grip-vertical" />
                    </v-btn>

                    <v-btn class="drag mr-2" size="sm" text @click="toggle(column.id)">
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
