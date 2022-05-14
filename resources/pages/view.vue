<script setup lang="ts">
import { useWindowApi } from '@/composables/api'
import { defineAsyncComponent, ref, watch } from 'vue'
import { useWorkspaceStore, Item } from '@/stores/workspace'

const store = useWorkspaceStore()
const api = useWindowApi()
const props = defineProps({
  workspace: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
})

const item = ref<Item>()
const loading = ref(false)

async function setItem() {
  await api
    .invoke('item:show', { workspace: props.workspace, path: props.path })
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
  <div class="h-full w-full relative">
    <is-toolbar />
    <div class="pt-10 px-16 h-[calc(100%_-_50px)]">
      <div v-if="!item">No items selected</div>

      <component
        :is="view.component"
        v-else-if="item && !loading"
        :item="item"
        :path="item.index || item.path"
      />

      <div v-if="loading" class="h-full w-full flex items-center justify-center absolute inset-0">
        <h2 class="text-2xl font-bold">Loading...</h2>
      </div>
    </div>
  </div>
</template>
