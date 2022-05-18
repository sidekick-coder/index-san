<script setup lang="ts">
import { defineAsyncComponent, ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Item } from '@/types'
import { useWindowApi } from '@/composables/api'

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

const defaultView = {
  name: 'default',
  component: defineAsyncComponent(() => import('@/views/default.vue')),
}

const views = [
  {
    name: 'editor',
    component: defineAsyncComponent(() => import('@/views/editor.vue')),
    test: (item: Item) => /md/.test(item.path),
  },
]

const view = shallowRef<any>(defaultView)

async function setItem() {
  loading.value = true

  await api
    .invoke('item:show', { path: props.path, workspace: props.workspace })
    .then((data) => (item.value = data))
    .catch(() => alert('Failed to load item'))
    .finally(() => setTimeout(() => (loading.value = false), 800))
}

function setView() {
  loading.value = true

  const search = views.find((view) => item.value && view.test(item.value))

  view.value = search || defaultView

  setTimeout(() => (loading.value = false), 500)
}

watch(props, setItem, {
  immediate: true,
})

watch(() => item.value, setView, {
  immediate: true,
})
</script>
<template>
  <w-layout use-percentage>
    <div
      v-if="loading"
      class="h-full w-full flex items-center justify-center absolute bg-white inset-0"
    >
      <div class="text-center">
        <fa-icon icon="spinner" class="animate-spin text-2xl" />
        <h2 class="font-bold">Loading...</h2>
      </div>
    </div>

    <w-content v-else-if="!item" class="flex items-center justify-center">
      Error loading item
    </w-content>

    <template v-else>
      <is-toolbar :layout-ignore="['right']" />
      <w-content>
        <component :is="view.component" :item="item" :path="item.path" />
      </w-content>

      <is-right-bar :item="item" right layout-id="right" />
    </template>
  </w-layout>
</template>
