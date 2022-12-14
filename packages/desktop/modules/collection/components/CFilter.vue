<script setup lang="ts">
import { CollectionColumn } from '@/../core/entities/collection'
import { computed } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'

import CFilterNumber from './CFilterNumber.vue'
import CFilterText from './CFilterText.vue'

// Props & Emits

const props = defineProps({
    modelValue: {
        type: Object,
        default: null,
    },
    columns: {
        type: Array as () => CollectionColumn[],
        default: () => [],
    },
})

const emit = defineEmits(['update:modelValue', 'destroy'])

// set value
const model = useVModel(props, 'modelValue', emit)

// set component
const components: Record<CollectionColumn['type'], any> = {
    text: CFilterText,
    number: CFilterNumber,
}

const selectedColumn = computed(() => props.columns.find((c) => c.id === model.value.column))
</script>
<template>
    <is-list-item align="end" class="gap-x-4">
        <is-select
            v-model="model.column"
            :options="columns"
            label-key="label"
            readonly
            value-key="id"
            class="max-w-[150px]"
        />

        <is-menu v-if="selectedColumn" offset-y>
            <template #activator="{ on }">
                <v-btn size="none" class="h-9 w-9 rounded-full" color="b-secondary" v-bind="on">
                    <is-icon name="cog" />
                </v-btn>
            </template>

            <v-card color="b-secondary" class="overflow-x-auto rounded mt-2">
                <v-card-content class="flex flex-wrap">
                    <component
                        :is="components[selectedColumn.type] || components.text"
                        v-model="model"
                    />
                </v-card-content>
            </v-card>
        </is-menu>

        <v-btn
            size="none"
            class="h-9 w-9 rounded-full"
            color="b-secondary"
            @click="$emit('destroy')"
        >
            <is-icon name="trash" />
        </v-btn>
    </is-list-item>
</template>
