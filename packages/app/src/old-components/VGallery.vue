<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
import uniq from 'lodash/uniq'
import { PropType } from 'vue'
import { useResizeObserver } from '@vueuse/core'

import { createBindings } from '@composables/binding'
import { useVModel } from 'vue-wind/composables/v-model'

// Props & Emits

const props = defineProps({
    modelValue: {
        type: Array as PropType<any[] | null>,
        default: null,
    },
    items: {
        type: Array as () => any[],
        default: () => [],
    },
    columns: {
        type: Array as () => any[],
        default: () => [],
    },
    sizes: {
        type: Object,
        default: () => ({}),
    },
    color: {
        type: String,
        default: 'b-secondary',
    },
    limit: {
        type: [String, Number],
        default: 20,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    itemKey: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['update:modelValue'])

// bindings
const attrs = useAttrs()

const bindings = computed(() => createBindings(attrs, ['card']))

// calculate break point
const rootRef = ref<HTMLElement>()
const breakpoint = ref<'sm' | 'md' | 'lg'>('md')

useResizeObserver(rootRef, (entries) => {
    const entry = entries[0]

    const { width } = entry.contentRect

    if (width < 640) {
        breakpoint.value = 'sm'
    }

    if (width > 640) {
        breakpoint.value = 'md'
    }

    if (width > 1024) {
        breakpoint.value = 'lg'
    }
})

// size
const size = computed(() => {
    const sizes = {
        sm: {
            width: 200,
            height: 'auto',
        },
        md: {
            width: 282,
            height: 'auto',
        },
        lg: {
            width: 200,
            height: 'auto',
        },
        ...props.sizes,
    }

    return sizes[breakpoint.value]
})

// pagination

const pagination = ref({ page: 1 })

const visibleItems = computed(() => props.items.slice(0, pagination.value.page * +props.limit))

// key

function getKey(item: any, index: number) {
    if (!props.itemKey) return index

    return item[props.itemKey]
}

// Selected

const selected = useVModel(props, 'modelValue', emit)

function onSelect(item: any, itemIndex: number, e: MouseEvent) {
    if (!selected.value) return

    e.preventDefault()

    const key = getKey(item, itemIndex)

    if (!e.ctrlKey && !e.shiftKey) {
        selected.value = [key]
        return
    }

    if (e.ctrlKey) {
        selected.value = uniq([...selected.value, key])
        return
    }

    if (!selected.value.length) {
        return
    }

    const start = selected.value[0]

    const firstIndex = props.items.findIndex((item) => getKey(item, itemIndex) === start)

    const lastIndex = props.items.findIndex((item) => getKey(item, itemIndex) === key)

    const startIndex = Math.min(firstIndex, lastIndex)
    const endIndex = Math.max(firstIndex, lastIndex)

    const all = props.items.slice(startIndex, endIndex + 1).map((item) => getKey(item, itemIndex))

    selected.value = all
}
</script>

<template>
    <div
        ref="rootRef"
        class="flex flex-wrap gap-4 relative"
        :class="loading ? 'animate-pulse' : ''"
        v-bind="bindings.root"
    >
        <v-card
            v-if="!items.length"
            width="100%"
            height="100"
            :color="color"
            class="flex items-center justify-center"
        >
            {{ $t('noEntity', [$t('item', 2)]) }}
        </v-card>

        <slot
            v-for="(item, index) in visibleItems"
            :key="item[itemKey]"
            name="item"
            :size="size"
            :index="index"
            :columns="columns"
            :color="color"
            :bindings="bindings"
            :item="item"
            :on-click="(e: MouseEvent) => onSelect(item, index, e)"
        >
            <v-card
                :width="size.width"
                :height="size.height"
                class="overflow-auto"
                :color="color"
                v-bind="bindings.card"
            >
                <template v-for="(column, cIndex) in columns" :key="cIndex">
                    <v-list-item class="px-4 py-2">
                        {{ item[column.field] }}
                    </v-list-item>
                </template>
            </v-card>
        </slot>

        <slot
            name="append-body"
            :size="size"
            :columns="columns"
            :items="items"
            :color="color"
            :bindings="bindings"
        />

        <v-card
            v-if="visibleItems.length < items.length"
            width="100%"
            class="cursor-pointer hover:bg-b-secondary"
            v-bind="bindings.card"
            @click="pagination.page++"
        >
            <v-card-content class="items-center justify-center text-sm text-t-secondary">
                <v-icon name="arrow-down" class="mr-4" />

                <span>{{ `${$t('loadMore')} (${visibleItems.length}/${items.length})` }}</span>
            </v-card-content>
        </v-card>
    </div>
</template>
