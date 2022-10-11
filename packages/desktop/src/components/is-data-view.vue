<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'

defineProps({
    items: {
        type: Array,
        default: () => []
    },
    columns: {
        type: Array,
        default: () => []
    },
})

defineEmits([
    'column:new',
    'column:update',
    'item:show',
    'item:new',
    'item:update',
    'item:delete',
    'item:refresh'
])

const current = ref(0)
const currentView = computed(() => allViews[current.value])

const allViews = [
    {
        label: 'Table',
        component: defineAsyncComponent(() => import('./is-data-view-table.vue'))
    },
    {
        label: 'Grid',
        component: defineAsyncComponent(() => import('./is-data-view-grid.vue'))
    },
]

</script>

<template>
    <div class="w-full">
        <div class="border-b border-gray-600 flex w-full">
            <div
                v-for="(view, index) in allViews"
                :key="index"
                class="text-sm px-4 py-2 border-b-2 cursor-pointer hover:bg-gray-800 rounded-t"
                :class="current === index ? 'border-teal-500' : 'border-transparent' "
                @click="current = index"
            >
                {{view.label}}
            </div>
        </div>
        
        
            <component
                :is="currentView.component"
                :items="items"
                :columns="columns"

                @column:new="$emit('column:new', $event)"
                @column:update="$emit('column:update', $event)"

                @item:show="$emit('item:show', $event)"
                @item:new="$emit('item:new', $event)"
                @item:update="$emit('item:update', $event)"
                @item:delete="$emit('item:delete', $event)"
                @item:refresh="$emit('item:refresh', $event)"
            >
                {{ currentView.label }}
            </component>
        

    </div>
</template>