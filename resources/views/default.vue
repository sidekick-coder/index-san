<script setup lang="ts">
import { Item } from '@/types'

defineProps({
  item: {
    type: Object as () => Item,
    required: true,
    default: () => ({}),
  },
})
</script>
<template>
  <div class="flex h-full w-full items-center justify-center">
    <w-card color="white" class="drop-shadow-md flex flex-wrap p-4 mx-auto max-w-[500px]">
      <div v-for="[key, value] in Object.entries(item)" :key="key" class="w-full mb-4">
        <b class="block">{{ key }}</b>
        <span> {{ value }}</span>
      </div>
    </w-card>
  </div>
</template>
