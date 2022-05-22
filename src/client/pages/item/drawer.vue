<script setup lang="ts">
import { orderBy } from 'lodash'
import { ref, PropType, watch } from 'vue'

import { useLayoutStore } from '@/stores/layout'
import { Item } from '@/types'
import { useCase } from '@/composables/use-case'

const layoutStore = useLayoutStore()

const props = defineProps({
  item: {
    type: Object as PropType<Item | null>,
    default: null,
  },
})

const subitems = ref<Item[]>([])

function dirname(path: string) {
  const args = path.split('\\|/')

  args.pop()

  return args[0]
}

async function setItems() {
  if (!props.item) {
    subitems.value = []
    return
  }

  const { item } = props

  const path = item.type === 'folder' ? item.path : dirname(item.path)

  useCase('list-items', {
    workspaceId: item.workspaceId,
    filters: {
      parentPath: path,
    },
  })
    .then((data) => (subitems.value = data))
    .catch(console.error)
}

watch(() => props.item?.path, setItems, {
  immediate: true,
})
</script>
<template>
  <w-drawer v-model="layoutStore.right" class="border-l bg-white" width="[300px]">
    <div v-if="!subitems.length" class="list-item">No Items found</div>
    <router-link
      v-for="child in orderBy(subitems, ['type', 'name'], ['desc', 'asc'])"
      :key="child.name"
      class="w-full list-item clickable border-b"
      :to="`/${child.workspaceId}/${child.path}`"
    >
      <i class="w-2/12" :class="child.type === 'file' ? 'text-gray-400' : ''">
        <fa-icon :icon="child.type === 'file' ? 'file' : 'folder'" />
      </i>
      <p class="truncate w-10/12">
        {{ child.name }}
      </p>
    </router-link>
  </w-drawer>
</template>
