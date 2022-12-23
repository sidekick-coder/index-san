<script lang="ts" setup>
import ViewCommon from '@/../core/entities/view-common'
import { useStore } from '@/store/global'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

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
const store = useStore()

const view = computed(() => store.view.get<ViewCommon>(props.collectionId, props.viewId))

// columns

const columns = computed(() => store.column.all(props.collectionId))

// desc options
const tm = useI18n()

const orderDescOptions = [
    { label: tm.t('descendant'), value: 'desc' },
    { label: tm.t('ascendant'), value: 'asc' },
]

// add & remove

function add() {
    if (!view.value) return

    view.value.orderBy.push({})
}

function remove(index: number) {
    if (!view.value) return

    view.value.orderBy.splice(index, 1)
}
</script>
<template>
    <v-menu v-if="view" v-model="menu" offset-y offset-x :open-on-click="false">
        <template #activator="{ attrs }">
            <div class="h-[44px] flex items-center" v-bind="attrs">
                <v-btn text size="sm" class="relative" @click="menu = !menu">
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
                <div v-if="!view.orderBy.length" class="text-t-secondary">
                    {{ $t('noEntity', [$t('item', 2)]) }}
                </div>

                <div
                    v-for="(order, index) in view.orderBy"
                    :key="index"
                    class="flex items-center gap-x-4"
                >
                    <v-select
                        v-model="order.field"
                        :label="$t('orderBy')"
                        :options="columns"
                        label-key="label"
                        value-key="field"
                    />

                    <v-select
                        v-model="order.desc"
                        :label="$t('descendant')"
                        label-key="label"
                        value-key="value"
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
