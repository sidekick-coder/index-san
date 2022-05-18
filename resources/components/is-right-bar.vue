<script setup lang="ts">
import { ref, PropType, watch } from 'vue'
import { useLayoutStore } from '@/stores/layout'
import { Item, File } from '@/types'
import { useWindowApi } from '@/composables/api'

const api = useWindowApi()
const layoutStore = useLayoutStore()

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
})

const files = ref<File[]>([])

async function setFiles() {
  await api
    .invoke('item:files', {
      path: props.item.path,
      workspace: props.item.workspace.name,
    })
    .then((data) => (files.value = data))
    .catch(() => alert('Error loading files'))
}

watch(() => props.item.path, setFiles, {
  immediate: true,
})
</script>
<template>
  <w-drawer v-model="layoutStore.right" class="border-l" width="[300px]">
    <div v-for="file in files" :key="file.name" class="list-item clickable">
      <div class="w-2/12 justify-start">
        <i class="icon">
          <fa-icon icon="file" class="mr-4" />
        </i>
      </div>

      <div class="grow">
        {{ file.name }}
      </div>
    </div>
  </w-drawer>
</template>
