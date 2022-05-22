<script setup lang="ts">
import { orderBy } from 'lodash'
import { useCase } from '@/composables/use-case'
import { Item } from '@/types'
import { ref } from 'vue'

const props = defineProps({
  item: {
    type: Object as () => Item,
    required: true,
  },
})

const subitems = ref<Item[]>([])

async function setItems() {
  useCase<Item[]>('list-items', {
    workspaceId: props.item.workspaceId,
    filters: {
      parentPath: props.item.path,
    },
  })
    .then((data) => (subitems.value = data))
    .catch(console.error)
}

async function load() {
  await setItems()
}

load()
</script>

<template>
  <div class="flex flex-wrap">
    <router-link
      v-for="child in orderBy(subitems, ['type', 'name'], ['desc', 'asc'])"
      :key="child.name"
      class="w-full"
      :to="`/${item.workspaceId}/${child.path}`"
    >
      <div class="list-item clickable border-b">
        <fa-icon
          :icon="child.type === 'file' ? 'file' : 'folder'"
          class="mr-4"
          :class="child.type === 'file' ? 'text-gray-400' : ''"
        />
        {{ child.name }}
      </div>
    </router-link>
  </div>
</template>
