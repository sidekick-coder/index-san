<script setup lang="ts">
import { useWindowApi } from '@/composables/api'
import { ref } from 'vue'

const props = defineProps({
  path: {
    type: String,
    default: '',
  },
})

const api = useWindowApi()

const metadata = ref({})

async function setItem() {
  if (!props.path) return

  const data = await api.invoke('file:metadata', { path: props.path })

  metadata.value = data
}

setItem()
</script>
<template>
  <div class="flex h-full w-full items-center justify-center">
    <w-card max-width="[500px]" color="white" class="drop-shadow-md flex flex-wrap p-4">
      <div v-for="[key, value] in Object.entries(metadata)" :key="key" class="w-full mb-4">
        <b class="block">{{ key }}</b>
        <span> {{ value }}</span>
      </div>
    </w-card>
  </div>
</template>
