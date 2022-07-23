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

const subitems = ref<Item[]>([])
const dialog = ref(false)
const databaseDialog = ref(false)

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

watch(() => props.item.id, load, { immediate: true })

async function deleteItem(item: Item) {
  await useCase('delete-item', { id: item.id }).then(load)
}

function getToPath(item: Item) {
  let view = 'details'

  if (item.type === 'folder') {
    view = 'file-explorer'
  }

  if (database.tables.find((table) => table.id === item.id)) {
    view = 'database-table'
  }

  return `/${item.id}?view=${view}`
}
</script>
<template>
  <w-layout use-percentage>
    <w-toolbar color="white" class="border-b" height="[40px]">
      <div class="px-4 flex items-center">
        <button
          class="w-8 h-8 rounded-full hover:bg-gray-100 justify-self-start disabled:opacity-25"
          @click="dialog = true"
        >
          <fa-icon class="text-sm" icon="plus" />
        </button>

        <button class="w-8 h-8 rounded-full hover:bg-gray-100" @click="databaseDialog = true">
          <fa-icon class="text-sm" icon="database" />
        </button>

        <button
          class="w-8 h-8 rounded-full hover:bg-gray-100 justify-self-start disabled:opacity-25"
          @click="load"
        >
          <fa-icon class="text-sm" icon="refresh" />
        </button>

        <button
          class="w-8 h-8 rounded-full hover:bg-gray-100 justify-self-start disabled:opacity-25"
          :disabled="!$router.options.history.state.back"
          @click="$router.back"
        >
          <fa-icon class="text-sm" icon="chevron-left" />
        </button>

        <button
          class="w-8 h-8 rounded-full hover:bg-gray-100 justify-self-start disabled:opacity-25"
          :disabled="!$router.options.history.state.forward"
          @click="$router.forward"
        >
          <fa-icon class="text-sm" icon="chevron-right" />
        </button>

        <h1 class="ml-4 font-bold text-xs">{{ item?.filepath }}</h1>
      </div>
    </w-toolbar>
    <w-content>
      <div v-if="!subitems.length" class="list-item">No Items found</div>
      <div
        v-for="child in orderBy(subitems, ['type', 'name'], ['desc', 'asc'])"
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

    <s-item-dialog v-model="dialog" :parent-filepath="item.filepath" @submit="load" />
    <s-database-table-dialog v-model="databaseDialog" :filepath="item.filepath" />
  </w-layout>
</template>
