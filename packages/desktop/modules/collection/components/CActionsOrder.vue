<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import ViewCommon from '@core/entities/view-common'

import { useView } from '@modules/view/composables/use-view'
import { useStore } from '@store/global'
import { withView } from '@modules/collection-column/composables/with-view'

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

// menu
const menu = ref(false)

// view

let view = useView<ViewCommon>(props.collectionId, props.viewId, new ViewCommon({}, props.viewId))

function setView() {
    view = useView<ViewCommon>(props.collectionId, props.viewId, new ViewCommon({}, props.viewId))
}

watch([() => props.viewId, () => props.collectionId], setView)

// columns
const store = useStore()

const collection = store.collection.get(props.collectionId)

const columns = computed(() => withView(collection?.columns || [], view.value?.columns))

const orderBy = computed({
    get() {
        return view.value.orderBy || []
    },
    set(value) {
        view.value = {
            ...view.value,
            orderBy: value,
        }
    },
})

// desc options
const tm = useI18n()

const orderDescOptions = [
    { label: tm.t('descendant'), value: 'desc' },
    { label: tm.t('ascendant'), value: 'asc' },
]

// add & remove

function add() {
    if (!view.value) return

    view.value.orderBy.push({
        field: columns.value[0].field,
    })
}

function remove(index: number) {
    if (!view.value) return

    view.value.orderBy.splice(index, 1)

    view.value.orderBy = view.value.orderBy.slice()
}
</script>
<template>
    <v-menu v-model="menu" offset-y offset-x :open-on-click="false">
        <template #activator="{ attrs }">
            <div class="h-[44px] flex items-center" v-bind="attrs">
                <v-btn mode="text" size="sm" class="relative" @click="menu = !menu">
                    <v-icon name="sort" />
                    <div
                        v-if="view.orderBy.length"
                        class="bg-accent h-2 w-2 rounded-full absolute top-0 right-0 group-hover/btn:text-t-primary"
                    />
                </v-btn>
            </div>
        </template>

        <v-card color="b-secondary" width="400">
            <v-card-content class="flex-wrap">
                <div v-if="!orderBy.length" class="text-t-secondary">
                    {{ $t('noEntity', [$t('item', 2)]) }}
                </div>

                <div
                    v-for="(order, index) in view.orderBy"
                    :key="index"
                    class="flex items-center gap-x-4 mb-4"
                >
                    <v-select
                        v-model="order.field"
                        :label="$t('orderBy')"
                        :options="columns"
                        label-key="label"
                        value-key="field"
                        card:color="b-primary"
                        menu:offset-y
                    />

                    <v-select
                        v-model="order.desc"
                        :label="$t('descendant')"
                        label-key="label"
                        value-key="value"
                        card:color="b-primary"
                        menu:offset-y
                        :options="orderDescOptions"
                    />

                    <v-btn size="sm" text rounded class="mt-7" @click="remove(index)">
                        <v-icon name="trash" />
                    </v-btn>
                </div>

                <div class="w-full mt-4">
                    <v-btn @click="add()">
                        {{ $t('addEntity', [$t('item', 2)]) }}
                    </v-btn>
                </div>
            </v-card-content>
        </v-card>
    </v-menu>
</template>
