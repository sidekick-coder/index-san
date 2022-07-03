<script setup lang="ts">
import { orderBy } from 'lodash'
import { ref, PropType, watch } from 'vue'

import { Item } from '@/types'
import { useCase } from '@/composables/use-case'

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    default: null,
  },
})

const subitems = ref<Item[]>([])
const dialog = ref(false)
const newItem = ref({
  type: 'file',
  filepath: '',
  workspaceId: props.item.workspaceId,
})

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

watch(() => props.item.id, setItems, { immediate: true })

async function submit() {
  await useCase('create-item', {
    type: newItem.value.type,
    workspaceId: newItem.value.workspaceId,
    filepath: `${props.item.filepath}/${newItem.value.filepath}`,
  }).then(() => {
    dialog.value = false
    setItems()
  })
}

async function deleteItem(item: Item) {
  await useCase('delete-item', {
    id: item.id,
  }).then(setItems)
}

function showDialog(type: 'folder' | 'file') {
  newItem.value.type = type
  dialog.value = true
}
</script>
<template>
  <w-layout use-percentage>
    <w-toolbar color="white" class="border-b" height="[40px]">
      <div class="px-4 flex items-center">
        <w-menu>
          <template #activator>
            <button
              class="w-8 h-8 rounded-full hover:bg-gray-100 justify-self-start disabled:opacity-25"
            >
              <fa-icon class="text-sm" icon="plus" />
            </button>
          </template>

          <div class="list-item clickable" @click="showDialog('folder')">
            <fa-icon class="text-sm mr-4" icon="folder-plus" />
            <span> Folder </span>
          </div>

          <div class="list-item clickable" @click="showDialog('file')">
            <fa-icon class="text-sm mr-4" icon="file-circle-plus" />
            <span> File </span>
          </div>
        </w-menu>

        <button
          class="w-8 h-8 rounded-full hover:bg-gray-100 justify-self-start disabled:opacity-25"
          @click="setItems"
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
        :key="child.name"
        class="w-full list-item clickable border-b"
        @dblclick="$router.push(child.id)"
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

    <w-dialog v-model="dialog">
      <w-form @submit="submit">
        <w-card class="p-5">
          <w-input v-model="newItem.filepath" label="Name" class="mb-4" />
          <w-btn>Submit</w-btn>
        </w-card>
      </w-form>
    </w-dialog>

    <!-- <w-drawer right class="border-l"> details </w-drawer> -->
  </w-layout>
</template>
