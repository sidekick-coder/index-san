<script setup lang="ts">
import { orderBy } from 'lodash'
import { ref, PropType, watch } from 'vue'

import { Item } from '@/types'
import { useCase } from '@/composables/use-case'

const props = defineProps({
  item: {
    type: Object as PropType<Item | null>,
    default: null,
  },
})

const subitems = ref<Item[]>([])

function dirname(path: string) {
  const args = path.split('/')

  args.pop()

  return args.join('/')
}

async function setItems() {
  if (!props.item) {
    subitems.value = []
    return
  }

  const { item } = props

  const parentId = item.type === 'folder' ? item.filepath : dirname(item.filepath)

  useCase('list-items', {
    where: {
      parentId: parentId || '/',
      workspaceId: item.workspaceId,
    },
  })
    .then((data) => (subitems.value = data))
    .catch(console.error)
}

watch(() => props.item?.id, setItems, {
  immediate: true,
})
</script>
<template>
  <div v-if="!subitems.length" class="list-item">No Items found</div>
  <router-link
    v-for="child in orderBy(subitems, ['type', 'name'], ['desc', 'asc'])"
    :key="child.name"
    class="w-full list-item clickable border-b"
    :to="child.id"
  >
    <i :class="child.type === 'file' ? 'text-gray-400' : ''" class="px-5">
      <fa-icon :icon="child.type === 'file' ? 'file' : 'folder'" />
    </i>
    <p class="truncate max-w-[80%]">
      {{ child.name }}
    </p>
  </router-link>
</template>
