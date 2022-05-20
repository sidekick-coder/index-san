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
    .catch(console.error)

  if (!model.value) {
    const index = files.value.find((file) => file.name.includes('index'))
    model.value = index || files.value[0] || null
  }
}

api.on('option:updated', (payload: any) => {
  console.log(payload)
  files.value
    .filter((file) => payload.name.includes(file.name))
    .forEach((file) => {
      file.displayName = payload.data.displayName
    })
})

watch(() => layoutStore.right, setFiles, {
  immediate: true,
})
</script>
<template>
  <w-drawer v-model="layoutStore.right" class="border-l bg-white" width="[300px]">
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
        {{ f.displayName }}
      </div>
    </div>
  </w-drawer>
</template>
