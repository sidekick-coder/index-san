<script setup lang="ts">
import { useWindowApi } from '@/composables/api'
import { useWorkspaceStore, Item } from '@/stores/workspace'
import { ref, watch } from 'vue'

const props = defineProps({
  path: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  isWorkspace: {
    type: Boolean,
    default: false,
  },
  deep: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['deleted'])

const api = useWindowApi()
const store = useWorkspaceStore()

const dialog = ref(false)
const expand = ref(false)
const loading = ref(false)
const name = ref('')
const children = ref<Item[]>([])

async function setChildren() {
  loading.value = true

  const data = await api.invoke<{ files: Item[] }>('item:show', { path: props.path })

  children.value = []

  children.value = data.files.filter((i) => i.isFolder)

  setTimeout(() => (loading.value = false), 500)
}

watch(
  () => expand.value,
  (v) => (v ? setChildren() : null)
)

async function deleteWorkspace() {
  await api.invoke('workspace:destroy', {
    path: props.path,
  })

  await store.setWorkspaces()
}

async function addItem() {
  await api
    .invoke('item:store', {
      path: props.path,
      name: name.value,
    })
    .finally(() => {
      dialog.value = false
    })

  await setChildren()
}

async function deleteItem() {
  if (store.current === props.path) {
    store.setCurrent(null)
  }

  await api
    .invoke('item:destroy', {
      path: props.path,
      name: name.value,
    })
    .then(() => alert('item deleted'))
    .catch(() => alert('error on delete item'))
    .finally(() => emit('deleted'))
}
</script>
<template>
  <div
    class="left-bar-item cursor-pointer hover:bg-gray-100"
    :style="`padding-left: ${deep}rem`"
    @click="store.setCurrent(path)"
  >
    <div class="w-2/12 justify-start">
      <i class="icon" @click="expand = !expand">
        <fa-icon v-if="loading" icon="spinner" class="animate-spin" />
        <fa-icon v-else :icon="expand ? 'chevron-down' : 'chevron-right'" />
      </i>
    </div>

    <div class="w-6/12 font-bold flex items-center">
      <fa-icon icon="folder" class="mr-2" />
      <p class="truncate">
        {{ label }}
      </p>
    </div>

    <div class="w-4/12 text-xs actions justify-end opacity-0">
      <i class="mr-2 icon">
        <fa-icon icon="plus" @click.stop="dialog = true" />
      </i>
      <i class="icon">
        <fa-icon v-if="isWorkspace" icon="link-slash" @click.stop="deleteWorkspace" />
        <fa-icon v-else icon="trash" @click.stop="deleteItem" />
      </i>
    </div>
  </div>

  <div v-if="expand" class="w-full">
    <div v-if="!children.length" class="left-bar-item" :style="`padding-left: ${deep + 1}rem`">
      No items
    </div>

    <is-left-bar-item
      v-for="item in children"
      :key="item.path"
      :label="item.name"
      :path="item.path"
      :deep="deep + 1"
      @deleted="setChildren"
    />
  </div>

  <w-dialog v-model="dialog">
    <w-form @submit="addItem">
      <w-card class="p-4 rounded">
        <w-input v-model="name" label="Name" placeholder="item name" class="mb-4" />
        <w-btn :disabled="!name" color="accent" text-color="white">Submit</w-btn>
      </w-card>
    </w-form>
  </w-dialog>
</template>

<style>
.left-bar-item {
  @apply px-[1rem] h-[50px] flex flex-wrap items-center transition-all text-sm;
}

.left-bar-item .icon {
  @apply w-8 h-8 flex items-center justify-center;
  @apply rounded-full hover:bg-gray-200;
}

.left-bar-item .actions {
  @apply flex justify-end items-center opacity-0;
}

.left-bar-item:hover .actions {
  @apply opacity-100;
}
</style>
