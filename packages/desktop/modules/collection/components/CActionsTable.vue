<script setup lang="ts">
import ViewTable from '@core/entities/view-gallery'

import { watch } from 'vue'

import { useView } from '@/modules/view/composables/use-view'

import debounce from 'lodash/debounce'

// Props & emit
const props = defineProps({
    collectionId: {
        type: String,
        required: true,
    },
    viewId: {
        type: String,
        default: '',
    },
})

// view

const { view, save, load } = useView<ViewTable>({
    collectionId: props.collectionId,
    viewId: props.viewId,
    defaultValue: new ViewTable({}, props.viewId),
})

watch([() => props.collectionId, () => props.viewId], () =>
    load({
        collectionId: props.collectionId,
        viewId: props.viewId,
    })
)

watch(view, debounce(save, 500), { deep: true })
</script>
<template>
    <v-card color="b-secondary" width="300">
        <v-card-content class="flex flex-wrap gap-y-4">
            <v-input v-model="view.label" :label="$t('label')" />

            <v-input v-model="view.limit" type="number" :label="$t('limit')" />
        </v-card-content>
    </v-card>
</template>
