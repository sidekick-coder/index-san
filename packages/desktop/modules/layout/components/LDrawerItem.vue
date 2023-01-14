<script setup lang="ts">
import { useState } from '@/composables/state'
import Menu from '@core/entities/menu'
import { computed } from 'vue'

const props = defineProps({
    item: {
        type: Object as () => Menu,
        required: true,
    },
    deep: {
        type: Number,
        default: 0,
    },
})

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
</script>
<template>
    <v-list-item
        :to="item.to"
        active-class="bg-t-secondary/10"
        size="none"
        color="hover:bg-t-secondary/5 "
        class="py-3 px-1 text-sm"
    >
        <v-btn
            class="w-[20px] h-[20px] mr-1 text-xs"
            text
            size="none"
            :class="[item.children.length && !item.isSection ? 'opacity-100' : 'opacity-0']"
            @click.prevent.stop="toggle"
        >
            <v-icon :name="show ? 'chevron-down' : 'chevron-right'" />
        </v-btn>
        <template v-if="item.isSection">
            <v-btn
                text
                size="px-2 -ml-2"
                color="hover:bg-b-primary/40"
                class="text-t-secondary font-bold"
                @click="toggle"
            >
                {{ item.label }}
            </v-btn>
        </template>

        <template v-else>
            <v-icon v-if="item.icon" :name="item.icon || 'circle'" class="mr-4" />

            <div>{{ item.label }}</div>
        </template>
    </v-list-item>

    <div v-if="show && item.children.length" :style="`margin-left: ${deep * 20}px`">
        <l-drawer-item
            v-for="(child, index) in item.children"
            :key="index"
            :item="child"
            :deep="deep + 1"
        />
    </div>
</template>
