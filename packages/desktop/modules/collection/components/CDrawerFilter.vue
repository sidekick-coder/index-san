<script setup lang="ts">
import { ref } from 'vue'

import Column from '@core/entities/column'
import { useVModel } from 'vue-wind/composables/v-model'
import { ViewFilter } from '@core/entities/view'

import CFilter from './CFilter.vue'

const props = defineProps({
    modelValue: {
        type: Array as () => ViewFilter[],
        default: () => [],
    },
    columns: {
        type: Array as () => Column[],
        default: () => [],
    },
})

const emit = defineEmits(['update:modelValue'])

const filters = useVModel(props, 'modelValue', emit)

const drawer = ref(false)

function clear() {
    filters.value = []
}

function add(column: Column) {
    filters.value.push({
        columnId: column.id,
        field: column.field,
        type: column.type,
        config: {},
        value: '',
    })
}
</script>

<template>
    <is-drawer v-model="drawer">
        <template #activator="{ attrs }">
            <v-btn text size="sm" v-bind="attrs" class="relative group/btn">
                <is-icon name="filter" />
                <div
                    v-if="filters.length"
                    class="bg-accent h-2 w-2 rounded-full absolute top-0 right-0 group-hover/btn:text-t-primary"
                />
            </v-btn>
        </template>

        <v-card-head class="px-4">
            <v-card-title class="text-t-secondary mr-auto">
                {{ $t('filter', 2) }}
            </v-card-title>

            <v-btn class="mr-4 text-uppercase" text color="warn" @click="clear">
                <is-icon name="brush" class="rotate-180 block" />
            </v-btn>

            <v-btn color="danger" text @click="drawer = false">
                <is-icon name="times" />
            </v-btn>
        </v-card-head>

        <c-filter
            v-for="(f, index) in filters"
            :key="index"
            :model-value="f"
            :columns="columns"
            @update:model-value="(v) => (filters[index] = v)"
            @destroy="filters.splice(index, 1)"
        />

        <v-card-content class="flex-wrap">
            <div v-if="!filters.length" class="w-full mb-3 text-t-secondary">
                {{ $t('noEntity', [$t('filter', 2)]) }}
            </div>

            <is-menu offset-y close-on-content-click>
                <template #activator="{ on }">
                    <v-btn v-bind="on" class="w-full" color="info">
                        <is-icon name="plus" class="mr-4" />
                        {{ $t('addEntity', [$t('filter')]) }}
                    </v-btn>
                </template>

                <v-card color="b-secondary">
                    <is-list-item v-for="c in columns" :key="c.id" @click="add(c)">
                        {{ c.label }}
                    </is-list-item>
                </v-card>
            </is-menu>
        </v-card-content>
    </is-drawer>
</template>
