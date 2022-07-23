<script setup lang="ts">
import { orderBy } from 'lodash'
import { ref, PropType, watch } from 'vue'

import { Item } from '../types'
import { useCase } from '../composables/use-case'
import { useDatabaseStore } from '../stories/database'

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    default: null,
  },
})

const database = useDatabaseStore()

const items = ref<Item[]>([])

function dirname(path: string) {
  const args = path.split('/')

  args.pop()

  return args.join('/')
}

async function load() {
  if (!database.tables.length) {
    await database.load()
  }

  if (!props.item) {
    items.value = []
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
    .then((data) => (items.value = data))
    .catch(console.error)
}

watch(() => props.item.id, load, { immediate: true })

async function deleteItem(item: Item) {
  await useCase('delete-item', { id: item.id }).then(load)
}

function getToPath(item: Item) {
  if (database.tables.find((t) => t.id === item.id)) {
    return `/${item.id}?view=database-table`
  }

  if (item.type === 'folder') {
    return `/${item.id}?view=file-explorer`
  }

  return `/${item.id}`
}
</script>
<template>
  <w-layout use-percentage>
    <w-content>
      <div v-if="!items.length" class="list-item">No Items found</div>
      <div
        v-for="child in orderBy(items, ['type', 'name'], ['desc', 'asc'])"
        :key="child.id"
        class="w-full list-item clickable border-b"
        @click="$router.push(getToPath(child))"
      >
        <i :class="child.type === 'file' ? 'text-gray-400' : ''" class="px-5">
          <fa-icon :icon="child.type === 'file' ? 'file' : 'folder'" />
        </i>

        <p class="truncate max-w-[80%]">{{ child.name }}</p>

        <div class="actions ml-auto">
          <i class="icon text-xs" @mousedown.stop="deleteItem(child)">
            <fa-icon icon="trash" />
          </i>
        </div>
      </div>
    </w-content>
  </w-layout>
</template>
