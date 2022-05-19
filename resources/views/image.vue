<script setup lang="ts">
import { File } from '@/types'

defineProps({
  file: {
    type: Object as () => File,
    required: true,
  },
})
</script>
<template>
  <div class="flex h-full w-full items-center justify-center">
    <w-card color="white" class="drop-shadow-md flex flex-wrap mx-auto max-w-[80%]">
      <img :src="`asset:${file.systemPath}`" class="w-full object-cover" />
    </w-card>
  </div>
</template>
