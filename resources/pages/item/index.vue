<script setup lang="ts">
import { defineAsyncComponent, ref, shallowRef, watch } from 'vue'
import { Item, File } from '@/types'
import { useWindowApi } from '@/composables/api'

import Toolbar from './toolbar.vue'
import Drawer from './drawer.vue'

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

const loading = ref({
  item: false,
  view: false,
})
const item = ref<Item>()
const file = ref<File>()
const view = shallowRef<any>()

const defaultView = {
  name: 'default',
  component: defineAsyncComponent(() => import('@/views/default.vue')),
}

const views = [
  {
    name: 'editor',
    component: defineAsyncComponent(() => import('@/views/editor.vue')),
    test: (filename: string) => /md/.test(filename),
  },
  {
    name: 'image',
    component: defineAsyncComponent(() => import('@/views/image.vue')),
    test: (filename: string) => /(png|jpg|jpeg|gif|svg)/.test(filename),
  },
]

async function setItem() {
  loading.value.item = true
  item.value = undefined
  file.value = undefined

  await api
    .invoke('item:show', { path: props.path, workspace: props.workspace })
    .then((data) => (item.value = data))
    .catch(() => alert('Failed to load item'))
    .finally(() => setTimeout(() => (loading.value.item = false), 800))
}

function setView() {
  loading.value.view = true

  const search = views.find((view) => {
    if (file.value) {
      return view.test(file.value.path)
    }

    return item.value && view.test(item.value?.path)
  })

  view.value = search || defaultView

  setTimeout(() => (loading.value.view = false), 500)
}

watch(props, setItem, {
  immediate: true,
})

watch(file, setView)
</script>
<template>
  <w-layout use-percentage>
    <div
      v-if="loading.item"
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
      <toolbar :layout-ignore="['right']" />

      <w-content
        v-if="loading.view"
        class="h-full w-full flex items-center justify-center absolute bg-white inset-0"
      >
        <div class="text-center">
          <fa-icon icon="spinner" class="animate-spin text-2xl" />
          <h2 class="font-bold">Loading...</h2>
        </div>
      </w-content>

      <w-content v-else-if="file">
        <component :is="view.component" :file="file" />
      </w-content>

      <w-content v-else class="flex items-center justify-center"> Select a file </w-content>

      <drawer v-model:file="file" :item="item" right layout-id="right" />
    </template>
  </w-layout>
</template>
