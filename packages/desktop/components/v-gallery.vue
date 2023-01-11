<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
import { createBindings } from '@/composables/binding'
import { computed, useAttrs, ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'

const props = defineProps({
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
