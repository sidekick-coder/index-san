<script setup lang="ts">
import ViewTable from '@core/entities/view-gallery'
import { useView } from '@modules/view/composables/use-view'
import { watch } from 'vue'

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

let view = useView<ViewTable>(props.collectionId, props.viewId, new ViewTable({}, props.viewId))

function setView() {
    view = useView<ViewTable>(props.collectionId, props.viewId, new ViewTable({}, props.viewId))
}

watch([() => props.viewId, () => props.collectionId], setView, { immediate: true })
</script>

<template>
    <v-card color="b-secondary" width="300">
        <v-card-content class="flex flex-wrap gap-y-4">
            <v-input v-model="view.label" :label="$t('label')" />

            <v-input v-model="view.limit" type="number" :label="$t('limit')" />
        </v-card-content>
    </v-card>
</template>
