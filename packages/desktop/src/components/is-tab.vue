<script setup>
import { onMounted,  ref, useSlots } from 'vue'

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
  <div class="is-tab">
    <header class="flex gap-x-4 border-b border-zinc-700 bg-zinc-900">
      <div
        v-for="(item, index) in items"
        :key="index"
        @click="current = index"
        class="cursor-pointer text-white hover:bg-zinc-700 h-full p-2 w-full"
      >
        {{ item.label }}
      </div>
    </header>
    <template v-for="(item, index) in items" :key="index">
      <component :is="item.component" v-if="current === index" />
    </template>
  </div>
</template>