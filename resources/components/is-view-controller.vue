<script setup lang="ts">
import { useWindowApi } from '@/composables/api'
import { defineAsyncComponent, ref, watch } from 'vue'
import { useWorkspaceStore, Item } from '@/stores/workspace'

const store = useWorkspaceStore()
const api = useWindowApi()

const item = ref<Item>()
const loading = ref(false)

async function setItem(path: string | null) {
  if (!path) {
    item.value = undefined
    return
  }

  await api
    .invoke('item:show', { path: path })
    .then((data) => (item.value = data))
    .catch(() => alert('Failed to load item'))
}

watch(() => store.current, setItem, {
  immediate: true,
})

const defaultView = {
  name: 'default',
  component: defineAsyncComponent(() => import('@/views/default.vue')),
}

const views = [
  {
    name: 'folder',
    component: defineAsyncComponent(() => import('@/views/folder.vue')),
    test: (item: Item) => item.isFolder,
  },
  {
    name: 'editor',
    component: defineAsyncComponent(() => import('@/views/editor.vue')),
    test: (item: Item) => /md/.test(item.index || item.path),
  },
]

const view = ref<any>(defaultView)

function setView() {
  loading.value = true

  const search = views.find((view) => item.value && view.test(item.value))

  view.value = search || defaultView

  setTimeout(() => (loading.value = false), 500)
}

watch(() => item.value, setView, {
  immediate: true,
})
</script>
<template>
  <div class="pt-10 px-16 h-full w-full relative">
    <div v-if="!item">No items selected</div>

    <component :is="view.component" v-else-if="item && !loading" :path="item.index || item.path" />

    <div v-if="loading" class="h-full w-full flex items-center justify-center absolute inset-0">
      <h2 class="text-2xl font-bold">Loading...</h2>
    </div>
  </div>
</template>
