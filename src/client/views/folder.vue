<script setup lang="ts">
import { useWindowApi } from '@/composables/api'
import { useWorkspaceStore } from '@/stores/workspace'
import { ref } from 'vue'

const props = defineProps({
  path: {
    type: String,
    default: '',
  },
})
const api = useWindowApi()
const store = useWorkspaceStore()
const files = ref<any>([])

function setFiles() {
  api
    .invoke('file:list-folder', { path: props.path })
    .then((data) => (files.value = data))
    .catch(() => alert('Failed to load files'))
}

setFiles()
</script>

<template>
  <div class="flex flex-wrap">
    <div class="w-full mb-4">
      <h2 class="font-bold text-2xl">List of files</h2>
    </div>

    <div v-for="file in files" :key="file.name" class="w-full" @click="store.setCurrent(file.path)">
      <w-btn color="white">
        {{ file.name }}
      </w-btn>
    </div>
  </div>
</template>
