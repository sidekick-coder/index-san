<script setup lang="ts">
import ViewGallery from '@core/entities/view-gallery'

import { computed, watch } from 'vue'
import { useStore } from '@store/global'

import { useView } from '@modules/view/composables/use-view'

import { withOnlyView, withView } from '@modules/collection-column/composables/with-view'

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

let view = useView<ViewGallery>(props.collectionId, props.viewId, new ViewGallery({}, props.viewId))

function setView() {
    view = useView<ViewGallery>(props.collectionId, props.viewId, new ViewGallery({}, props.viewId))
}

watch([() => props.viewId, () => props.collectionId], setView, { immediate: true })

// columns
const store = useStore()

const collection = store.collection.get(props.collectionId)

const columns = computed({
    get() {
        return withView(collection?.columns || [], view.value?.columns)
    },
    set(value) {
        view.value = {
            ...view.value,
            columns: withOnlyView(value),
        }
    },
})
</script>
<template>
    <v-card v-if="view.component === 'gallery'" color="b-secondary">
        <v-card-content class="flex flex-wrap gap-y-4">
            <v-input v-model="view.label" :label="$t('label')" />
            <v-input v-model="view.limit" type="number" :label="$t('limit')" />

            <v-select
                v-model="view.thumbnail.key"
                :options="columns"
                label-key="label"
                value-key="field"
                :label="$t('thumbnail')"
            />

            <v-select
                v-model="view.thumbnail.fit"
                :options="['cover', 'contain', 'fill', 'none', 'scale-down']"
                :label="$t('fit')"
            />

            <v-select
                v-model="view.thumbnail.position"
                :options="[
                    'top',
                    'bottom',
                    'center',
                    'left',
                    'right',

                    'left-top',
                    'left-bottom',
                    'right-top',
                    'right-bottom',
                ]"
                :label="$t('position')"
            />

            <div class="flex gap-x-4">
                <v-input
                    v-model="view.sizes.sm.width"
                    :label="$t('widthEntity', ['sm'])"
                    class="max-w-[80px]"
                />

                <v-input
                    v-model="view.sizes.md.width"
                    :label="$t('widthEntity', ['md'])"
                    class="max-w-[80px]"
                />

                <v-input
                    v-model="view.sizes.lg.width"
                    :label="$t('widthEntity', ['lg'])"
                    class="max-w-[80px]"
                />
            </div>

            <div class="flex gap-x-4">
                <v-input
                    v-model="view.sizes.sm.height"
                    :label="$t('heightEntity', ['sm'])"
                    class="max-w-[80px]"
                />

                <v-input
                    v-model="view.sizes.md.height"
                    :label="$t('heightEntity', ['md'])"
                    class="max-w-[80px]"
                />

                <v-input
                    v-model="view.sizes.lg.height"
                    :label="$t('heightEntity', ['lg'])"
                    class="max-w-[80px]"
                />
            </div>
        </v-card-content>
    </v-card>
</template>
