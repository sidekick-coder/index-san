<script setup lang="ts">
import { defineAsyncComponent, ref, shallowRef, watch } from 'vue'

import { Item } from '@/types'
import { useCase } from '@/composables/use-case'

import Toolbar from './toolbar.vue'
import Drawer from './drawer.vue'

const props = defineProps({
  workspaceId: {
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
const view = shallowRef<any>()

const views = [
  {
    name: 'default',
    component: defineAsyncComponent(() => import('@/views/default.vue')),
    test: () => false,
  },
  {
    name: 'folder',
    component: defineAsyncComponent(() => import('@/views/folder.vue')),
    test: () => props.path === 'root',
  },
  {
    name: 'editor',
    component: defineAsyncComponent(() => import('@/views/editor/index.vue')),
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

  useCase<Item>('show-item', {
    workspaceId: props.workspaceId,
    path: props.path === 'root' ? '' : props.path,
  })
    .then((data) => (item.value = data))
    .catch(console.error)
    .finally(() => setTimeout(() => (loading.value.item = false), 500))
}

async function setView() {
  loading.value.view = true

  const search = views.find((view) => view.test(props.path))

  const defaultView = views.find((view) => view.name === 'default')

  view.value = search || defaultView

  setTimeout(() => (loading.value.view = false), 500)
}

watch(props, setItem, {
  immediate: true,
})

watch(item, setView)
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
      <Toolbar :item="item" :layout-ignore="['right']" />

      <w-content
        v-if="loading.view"
        class="h-full w-full flex items-center justify-center absolute bg-white inset-0"
      >
        <div class="text-center">
          <fa-icon icon="spinner" class="animate-spin text-2xl" />
          <h2 class="font-bold">Loading...</h2>
        </div>
      </w-content>

      <w-content v-if="item" v-show="!loading.view">
        <div class="h-full w-full overflow-auto">
          <component :is="view.component" :item="item" />
        </div>
      </w-content>

      <w-content v-else class="flex items-center justify-center"> Error </w-content>

      <Drawer :item="item" right layout-id="right" /> -->
    </template>
  </w-layout>
</template>
