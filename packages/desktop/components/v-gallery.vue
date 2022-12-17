<script setup lang="ts">
import { createBindings } from '@/composables/binding'
import { computed, useAttrs } from 'vue'

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

    return sizes.md
})

// bidings
const attrs = useAttrs()
const bindigns = computed(() => createBindings(attrs, ['card']))
</script>

<template>
    <div class="flex flex-wrap gap-4">
        <slot
            v-for="(item, index) in items"
            name="item"
            :size="size"
            :index="index"
            :columns="columns"
        >
            <v-card
                :key="index"
                :width="size.width"
                :height="size.height"
                class="overflow-auto"
                :color="color"
                v-bind="bindigns.card"
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
    </div>
</template>
