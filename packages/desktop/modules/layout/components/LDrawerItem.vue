<script setup lang="ts">
import Menu from '@core/entities/menu'

import VDraggable from 'vuedraggable'

import { useState } from '@composables/state'

const props = defineProps({
    item: {
        type: Object as () => Menu,
        required: true,
    },
    deep: {
        type: Number,
        default: 0,
    },
    dragOptions: {
        type: Object,
        default: () => ({}),
    },
})

const emit = defineEmits(['update'])

// toggle children
const hideSections = useState<string[]>('app:menu:hide', [], {
    localStorage: true,
})

function toggle() {
    const index = hideSections.value.findIndex((i) => i === props.item.id)

    if (index !== -1) {
        hideSections.value.splice(index, 1)
        hideSections.value = hideSections.value.slice()
        return
    }

    hideSections.value.push(props.item.id)

    hideSections.value = hideSections.value.slice()
}

const show = computed(() => !hideSections.value.includes(props.item.id))

watch(
    () => props.item,
    () => emit('update'),
    { deep: true }
)
</script>
<template>
    <v-list-item
        :to="item.to"
        active-class="bg-t-secondary/10"
        size="none"
        color="hover:bg-t-secondary/5 "
        class="py-2 text-sm"
    >
        <v-btn
            mode="text"
            size="xs"
            class=""
            color="text-t-secondary"
            :class="[
                (item.children.length && !item.isSection) || (!show && item.isSection)
                    ? 'opacity-100'
                    : 'opacity-0',
            ]"
            @click.prevent.stop="toggle"
        >
            <v-icon :name="show ? 'caret-down' : 'caret-right'" />
        </v-btn>

        <template v-if="item.isSection">
            <v-btn
                mode="text"
                size="xs"
                color="hover:bg-b-primary/40"
                class="text-t-secondary font-bold -ml-2"
                @click="toggle"
            >
                {{ item.label }}
            </v-btn>
        </template>

        <template v-else>
            <v-btn class="-ml-1 mr-2" size="xs" color="hover:bg-b-primary/40" mode="text">
                <v-icon v-if="item.icon" :name="item.icon"></v-icon>
                <v-icon v-else name="circle"></v-icon>
            </v-btn>

            <div>{{ item.label }}</div>
        </template>
    </v-list-item>

    <v-draggable
        v-if="show && item.children.length"
        v-bind="dragOptions"
        :list="item.children"
        :component-data="{
            style: `margin-left: ${deep * 20}px`,
        }"
    >
        <template #item="{ index }">
            <div>
                <l-drawer-item
                    :item="item.children[index]"
                    :deep="deep + 1"
                    :drag-options="dragOptions"
                    @update="$t('update')"
                />
            </div>
        </template>
    </v-draggable>
</template>
