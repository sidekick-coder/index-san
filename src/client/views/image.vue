<script setup lang="ts">
import { Item, Workspace } from '@/types'

defineProps({
  workspace: {
    type: Object as () => Workspace,
    required: true,
  },
  item: {
    type: Object as () => Item,
    required: true,
  },
})
</script>
<template>
  <div class="flex h-full w-full items-center justify-center">
    <w-card color="white" class="drop-shadow-md flex flex-wrap mx-auto max-w-[80%]">
      <img :src="`${workspace.path}\\${item.path}`" class="w-full object-cover" />
    </w-card>
  </div>
</template>
