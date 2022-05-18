<script setup lang="ts">
import { File } from '@/types'
import { capitalize } from 'lodash'
import { computed } from 'vue'

const props = defineProps({
  file: {
    type: Object as () => File,
    required: true,
  },
})

const keys = computed(() => Object.entries(props.file).filter(([_k, v]) => typeof v === 'string'))
</script>
<template>
  <div class="flex h-full w-full items-center justify-center">
    <w-card color="white" class="drop-shadow-md flex flex-wrap p-4 mx-auto max-w-[500px]">
      <div v-for="[key, value] in keys" :key="key" class="w-full mb-4">
        <b class="block">{{ capitalize(key) }}</b>
        <span> {{ value }}</span>
      </div>
    </w-card>
  </div>
</template>
