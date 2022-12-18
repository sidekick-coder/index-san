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
})

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

// bindings
const attrs = useAttrs()

const bindings = computed(() => createBindings(attrs, ['card']))
</script>

<template>
    <div ref="rootRef" class="flex flex-wrap gap-4">
        <slot
            v-for="(item, index) in items"
            name="item"
            :size="size"
            :index="index"
            :columns="columns"
            :color="color"
            :bindings="bindings"
            :item="item"
        >
            <v-card
                :key="index"
                :width="size.width"
                :height="size.height"
                class="overflow-auto"
                :color="color"
                v-bind="bindings.card"
            >
                <template v-for="(column, cIndex) in columns" :key="cIndex">
                    <is-list-item class="px-4 py-2">
                        {{ item[column.field] }}
                    </is-list-item>
                </template>
            </v-card>
        </slot>

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
            name="append-body"
            :size="size"
            :columns="columns"
            :items="items"
            :color="color"
            :bindings="bindings"
        />
    </div>
</template>
