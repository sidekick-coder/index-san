<script setup lang="ts">
import Column from '@index-san/core/entities/column'
import { computed } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'
import { ViewFilter } from '@index-san/core/entities/view-common'

import CFilterNumber from './CFilterNumber.vue'
import CFilterRelation from './CFilterRelation.vue'
import CFilterScript from './CFilterScript.vue'
import CFilterSelect from './CFilterSelect.vue'
import CFilterText from './CFilterText.vue'
import CFilterDate from './CFilterDate.vue'

// Props & Emits

const props = defineProps({
    modelValue: {
        type: Object as () => ViewFilter,
        default: null,
    },
    columns: {
        type: Array as () => Column[],
        default: () => [],
    },
})

const emit = defineEmits(['update:modelValue', 'destroy'])

// set value
const model = useVModel(props, 'modelValue', emit)

// set component
const components: Record<Column['type'], any> = {
    text: CFilterText,
    number: CFilterNumber,
    relation: CFilterRelation,
    select: CFilterSelect,
    script: CFilterScript,
    entry: CFilterText,
    createdAt: CFilterText,
    updatedAt: CFilterText,
    link: CFilterText,
    date: CFilterDate,
    checkbox: CFilterText,
}

const column = computed(() => props.columns.find((c) => c.id === model.value.columnId))
</script>
<template>
    <v-card v-if="column" class="gap-x-4 flex-wrap">
        <v-card-content>
            <v-card class="border border-lines">
                <v-card-head padding>
                    <v-card-title class="mr-auto">
                        {{ column.label }}
                    </v-card-title>

                    <v-btn color="danger" text size="sm" @click="$emit('destroy')">
                        <v-icon name="trash" />
                    </v-btn>
                </v-card-head>
                <v-card-content class="flex flex-wrap">
                    <component
                        :is="components[column.type] || components.text"
                        v-model="model"
                        :column="column"
                    />
                </v-card-content>
            </v-card>
        </v-card-content>
    </v-card>
</template>
