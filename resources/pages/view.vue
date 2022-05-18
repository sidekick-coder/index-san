<script setup lang="ts">
import { useWindowApi } from '@/composables/api'
import { defineAsyncComponent, ref, shallowRef, watch } from 'vue'
import { Item } from '@/stores/workspace'
import { useRoute } from 'vue-router'

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
const route = useRoute()

async function setItem() {
  loading.value = true
  await api
    .invoke('item:show', { workspace: props.workspace, path: props.path })
    .then((data) => (item.value = data))
    .catch(() => alert('Failed to load item'))
    .finally(() => setTimeout(() => (loading.value = false), 800))
}

const defaultView = {
  name: 'default',
  component: defineAsyncComponent(() => import('@/views/default.vue')),
}

const views = [
  {
    name: 'editor',
    component: defineAsyncComponent(() => import('@/views/editor.vue')),
    test: (item: Item) => /md/.test(item.index || item.path),
  },
]

const view = shallowRef<any>(defaultView)

function setView() {
  loading.value = true

  const search = views.find((view) => item.value && view.test(item.value))

  view.value = search || defaultView

  setTimeout(() => (loading.value = false), 500)
}

watch(() => route.fullPath, setItem, {
  immediate: true,
})

watch(() => item.value, setView, {
  immediate: true,
})
</script>
<template>
  <div class="h-full w-full relative">
    <div
      v-if="loading"
      class="h-full w-full flex items-center justify-center absolute bg-white inset-0"
    >
      <div class="text-center">
        <fa-icon icon="spinner" class="animate-spin text-2xl" />
        <h2 class="font-bold">Loading...</h2>
      </div>
    </div>

    <component :is="view.component" v-if="item" :item="item" :path="item.index || item.path" />
  </div>
</template>
