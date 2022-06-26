<script setup lang="ts">
import lodash from 'lodash'

import { computed, defineAsyncComponent, ref, watch } from 'vue'

import { Item } from '@/types'
import { useCase } from '@/composables/use-case'

const props = defineProps({
  itemId: {
    type: String,
    required: true,
  },
})

const loading = ref({
  item: false,
  view: false,
})

const item = ref<Item>()
const viewId = ref<string>()

const currentView = computed(() => views.find((view) => view.id === viewId.value))

const suggestedViewId = computed(() => {
  if (item.value?.type === 'folder') {
    return 'folder'
  }

  if (/(.md|yml)/.test(item.value?.filepath || '')) {
    return 'editor'
  }

  if (/(.png|jpg)/.test(item.value?.filepath || '')) {
    return 'image'
  }

  return 'default'
})

const views = [
  {
    id: 'default',
    label: 'Details',
    component: defineAsyncComponent(() => import('@/views/default.vue')),
  },
  {
    id: 'folder',
    label: 'Folder',
    component: 's-directory-list',
  },
  {
    id: 'editor',
    label: 'Editor',
    component: defineAsyncComponent(() => import('@/views/simple-editor.vue')),
  },
  {
    id: 'image',
    label: 'Image',
    component: defineAsyncComponent(() => import('@/views/image.vue')),
  },
  {
    id: 'data-view',
    label: 'Data-view',
    component: defineAsyncComponent(() => import('@/views/data-view/data-view.vue')),
  },
]

async function load() {
  loading.value.item = true

  await useCase<Item>('show-item', {
    id: props.itemId,
  })
    .then((data) => (item.value = data))
    .catch(console.error)
    .finally(() => {
      viewId.value = lodash.get(item.value, 'view', suggestedViewId.value)

      setTimeout(() => (loading.value.item = false), 200)
    })
}

watch(props, load, {
  immediate: true,
})
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
      <w-content
        v-if="loading.view"
        class="h-full w-full flex items-center justify-center absolute bg-white inset-0"
      >
        <div class="text-center">
          <fa-icon icon="spinner" class="animate-spin text-2xl" />
          <h2 class="font-bold">Loading...</h2>
        </div>
      </w-content>

      <w-content v-if="currentView" v-show="!loading.view">
        <div class="h-full w-full overflow-auto">
          <component :is="currentView.component" :item="item" />
        </div>
      </w-content>

      <w-content v-else class="flex items-center justify-center"> Error </w-content>
    </template>
  </w-layout>
</template>
