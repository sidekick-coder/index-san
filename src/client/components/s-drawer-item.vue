<script setup lang="ts">
import { useCase } from '@/composables/use-case'
import { useWorkspaceStore } from '@/stores/workspace'
import { Item } from '@/types'
import { ref, watch } from 'vue'

const props = defineProps({
  itemId: {
    type: String,
    required: true,
  },
  workspaceId: {
    type: String,
    required: true,
  },
  to: {
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
  isWorkspace: {
    type: Boolean,
    default: false,
  },
})

const store = useWorkspaceStore()

const dialog = ref(false)
const expand = ref(false)
const loading = ref(false)
const name = ref('')
const children = ref<Item[]>([])

async function setChildren() {
  loading.value = true

  useCase<Item[]>('list-items', {
    where: {
      workspaceId: props.workspaceId,
      parentId: props.itemId,
    },
  })
    .then((data) => {
      children.value = data.filter((item) => item.type === 'folder')
    })
    .catch(console.error)
    .finally(() => setTimeout(() => (loading.value = false), 500))
}

watch(
  () => expand.value,
  (v) => (v ? setChildren() : null)
)

async function deleteWorkspace() {
  await useCase('delete-workspace', props.workspaceId)
    .catch(console.error)
    .then(store.setWorkspaces)
}

async function addItem() {
  const basename = name.value.split(/\/|\\/).pop()

  await useCase('create-item', {
    workspaceId: props.workspaceId,
    name: name.value,
    displayName: basename,
  })
    .catch(console.error)
    .finally(() => (dialog.value = false))
}

async function deleteItem() {
  // await api
  //   .invoke('item:destroy', {
  //     id: props.id,
  //     name: name.value,
  //   })
  //   .then(() => alert('item deleted'))
  //   .catch(() => alert('error on delete item'))
  //   .finally(() => emit('deleted'))
}
</script>
<template>
  <router-link class="list-item clickable" :style="`padding-left: ${deep}rem`" :to="to">
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
        <fa-icon v-if="isWorkspace" icon="link-slash" @click.stop="deleteWorkspace" />
        <fa-icon v-else icon="trash" @click.stop="deleteItem" />
      </i>
    </div>
  </router-link>

  <div v-if="expand" class="w-full">
    <div v-if="!children.length" class="list-item" :style="`padding-left: ${deep + 1}rem`">
      No items
    </div>

    <s-drawer-item
      v-for="item in children"
      :key="item.id"
      :to="`/${workspaceId}/${item.id}`"
      :item-id="item.id"
      :workspace-id="workspaceId"
      :label="item.name"
      :deep="deep + 1"
    />
  </div>

  <teleport to="body">
    <w-dialog v-model="dialog">
      <w-form @submit="addItem">
        <w-card class="p-4 rounded">
          <w-input v-model="name" label="Name" placeholder="item name" class="mb-4" />
          <w-btn :disabled="!name" color="accent" text-color="white">Submit</w-btn>
        </w-card>
      </w-form>
    </w-dialog>
  </teleport>
</template>
