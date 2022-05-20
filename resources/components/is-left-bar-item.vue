<script setup lang="ts">
import { useWindowApi } from '@/composables/api'
import { useWorkspaceStore } from '@/stores/workspace'
import { Item } from '@/types'
import { ref, watch } from 'vue'

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  workspace: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
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

  await api
    .invoke('item:subitems', {
      path: props.path,
      workspace: props.workspace,
    })
    .then((data) => (children.value = data))
    .catch(() => alert('Error loading items'))

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
  <router-link
    class="list-item clickable"
    :style="`padding-left: ${deep}rem`"
    :to="`/${workspace}/${path}`"
  >
    <div class="w-2/12 justify-start">
      <i class="icon" @click.stop="expand = !expand">
        <fa-icon v-if="loading" icon="spinner" class="animate-spin" />
        <fa-icon v-else :icon="expand ? 'chevron-down' : 'chevron-right'" />
      </i>
    </div>

    <div class="w-6/12 font-bold flex items-center">
      <fa-icon icon="file" class="mr-4" />
      <p class="truncate">
        {{ label }}
      </p>
    </div>

    <div class="w-4/12 text-xs actions justify-end opacity-0">
      <i class="mr-2 icon">
        <fa-icon icon="plus" @click.stop="dialog = true" />
      </i>
      <i class="icon">
        <fa-icon v-if="workspace === path" icon="link-slash" @click.stop="deleteWorkspace" />
        <fa-icon v-else icon="trash" @click.stop="deleteItem" />
      </i>
    </div>
  </router-link>

  <div v-if="expand" class="w-full">
    <div v-if="!children.length" class="list-item" :style="`padding-left: ${deep + 1}rem`">
      No items
    </div>

    <is-left-bar-item
      v-for="item in children"
      :key="item.path"
      :label="item.name"
      :workspace="workspace"
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
