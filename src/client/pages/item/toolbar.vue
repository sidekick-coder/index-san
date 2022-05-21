<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import { Item } from '@/types'

defineProps({
  item: {
    type: Object as () => Item,
    required: true,
  },
})

const layoutStore = useLayoutStore()
</script>
<template>
  <w-toolbar class="toolbar border-b h-[50px] flex justify-end z-10" color="white">
    <button class="btn-toolbar justify-self-start hided-actions" @click="layoutStore.toggleLeft">
      <fa-icon class="text-lg" icon="chevron-right" :class="layoutStore.left ? 'rotate-180' : ''" />
    </button>
    <div class="justify-self-start mr-auto font-bold">
      {{ item.name }}
    </div>
    <button class="btn-toolbar">
      <fa-icon icon="eye" />
    </button>
    <button class="btn-toolbar" @click="layoutStore.toggleRight">
      <fa-icon icon="folder" />
    </button>
    <button class="btn-toolbar">
      <fa-icon icon="cog" />
    </button>
  </w-toolbar>
</template>

<style>
.btn-toolbar {
  @apply h-full w-[60px] hover:bg-gray-100;
}

.toolbar .hided-actions {
  @apply opacity-25 transition-all;
}

.toolbar:hover .hided-actions {
  @apply opacity-100;
}
</style>
