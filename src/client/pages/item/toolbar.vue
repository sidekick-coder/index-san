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
    <button class="btn-toolbar justify-self-start" @click="layoutStore.toggleLeft">
      <fa-icon class="text-lg" icon="bars" />
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
</style>
