<script setup>
import { onMounted, ref, useSlots } from 'vue'

const current = ref(0)
const items = ref([])
const slots = useSlots()

function setItem() {
    items.value = []

    if (!slots.default) return

    const children = slots.default()

    children
        .filter((c) => typeof c.type === 'object')
        .filter((c) => c.type.name === 'IsTabItem')
        .forEach((c) => {
            items.value.push({
                label: c.props.label,
                component: c,
            })
        })
}

onMounted(setItem)
</script>
<template>
    <div class="v-tab">
        <header class="flex gap-x-4 border-b border-b-primary bg-b-primary">
            <div
                v-for="(item, index) in items"
                :key="index"
                class="cursor-pointer text-t-primary hover:bg-b-primary h-full p-2 w-full"
                @click="current = index"
            >
                {{ item.label }}
            </div>
        </header>
        <template v-for="(item, index) in items">
            <component :is="item.component" v-if="current === index" :key="index" />
        </template>
    </div>
</template>
