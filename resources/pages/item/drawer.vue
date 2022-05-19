<script setup lang="ts">
import { ref, PropType, watch } from 'vue'
import { useLayoutStore } from '@/stores/layout'
import { Item, File } from '@/types'
import { useWindowApi } from '@/composables/api'
import { useVModel } from '@vueuse/core'

const api = useWindowApi()
const layoutStore = useLayoutStore()

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
  file: {
    type: Object as PropType<File | null>,
    default: null,
  },
})

const emit = defineEmits(['update:file'])

const files = ref<File[]>([])
const model = useVModel(props, 'file', emit)

async function setFiles() {
  if (files.value.length) {
    return
  }

  await api
    .invoke('item:files', {
      path: props.item.path,
      workspace: props.item.workspace.name,
    })
    .then((data) => (files.value = data))
    .catch(() => alert('Error loading files'))
}

watch(() => layoutStore.right, setFiles, {
  immediate: true,
})
</script>
<template>
  <w-drawer v-model="layoutStore.right" class="border-l" width="[300px]">
    <div
      v-for="f in files"
      :key="f.name"
      class="list-item clickable"
      :class="model?.path === f.path ? 'bg-gray-100' : ''"
      @click="model = f"
    >
      <div class="w-2/12 justify-start">
        <i class="icon">
          <fa-icon icon="file" class="mr-4" />
        </i>
      </div>

      <div class="w-8/12 truncate">
        {{ f.name }}
      </div>
    </div>
  </w-drawer>
</template>
