<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import Column from '@core/entities/column'
import ViewCommon from '@core/entities/view-common'

import CFilter from './CFilter.vue'
import { useView } from '@modules/view/composables/use-view'
import { useStore } from '@store/global'

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

const store = useStore()

const columns = computed(() => store.column.all(props.collectionId))

if (!columns.value.length) {
    store.column.set(props.collectionId)
}

// view

let view = useView<ViewCommon>(props.collectionId, props.viewId, new ViewCommon({}, props.viewId))

function setView() {
    view = useView<ViewCommon>(props.collectionId, props.viewId, new ViewCommon({}, props.viewId))
}

watch([() => props.viewId, () => props.collectionId], setView, { immediate: true })

const drawer = ref(false)

function clear() {
    view.value = {
        ...view.value,
        filters: [],
    }
}

function add(column: Column) {
    const filters = view.value.filters.slice()

    filters.push({
        columnId: column.id,
        field: column.field,
        type: column.type,
        config: {},
        value: '',
    })

    view.value = {
        ...view.value,
        filters,
    }
}
</script>

<template>
    <v-drawer v-model="drawer">
        <template #activator="{ attrs }">
            <v-btn text size="sm" v-bind="attrs" class="relative group/btn">
                <v-icon name="filter" />
                <div
                    v-if="view.filters.length"
                    class="bg-accent h-2 w-2 rounded-full absolute top-0 right-0 group-hover/btn:text-t-primary"
                />
            </v-btn>
        </template>

        <v-card-head class="px-4">
            <v-card-title class="text-t-secondary mr-auto">
                {{ $t('filter', 2) }}
            </v-card-title>

            <v-btn class="mr-4 text-uppercase" text color="warn" @click="clear">
                <v-icon name="brush" class="rotate-180 block" />
            </v-btn>

            <v-btn color="danger" text @click="drawer = false">
                <v-icon name="times" />
            </v-btn>
        </v-card-head>

        <c-filter
            v-for="(f, index) in view.filters"
            :key="index"
            :model-value="f"
            :columns="columns"
            @update:model-value="(v) => (view.filters[index] = v)"
            @destroy="view.filters.splice(index, 1)"
        />

        <v-card-content class="flex-wrap">
            <div v-if="!view.filters.length" class="w-full mb-3 text-t-secondary">
                {{ $t('noEntity', [$t('filter', 2)]) }}
            </div>

            <v-menu offset-y close-on-content-click>
                <template #activator="{ attrs }">
                    <v-btn v-bind="attrs" class="w-full" color="info">
                        <v-icon name="plus" class="mr-4" />
                        {{ $t('addEntity', [$t('filter')]) }}
                    </v-btn>
                </template>

                <v-card color="b-secondary">
                    <v-list-item v-for="c in columns" :key="c.id" @click="add(c)">
                        {{ c.label }}
                    </v-list-item>
                </v-card>
            </v-menu>
        </v-card-content>
    </v-drawer>
</template>
