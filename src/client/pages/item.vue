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

const item = ref<Item>()
const viewId = ref<string>()

const currentView = computed(() => views.find((view) => view.id === viewId.value))

const suggestedViewId = computed(() => {
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
    label: 'Default',
    component: defineAsyncComponent(() => import('@/views/file-explorer.vue')),
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
  await useCase<Item>('show-item', {
    id: props.itemId,
  })
    .then((data) => (item.value = data))
    .catch(console.error)
    .finally(() => {
      viewId.value = lodash.get(item.value, 'view', suggestedViewId.value)
    })
}

watch(props, load, {
  immediate: true,
})
</script>
<template>
  <w-layout use-percentage>
    <w-content v-if="currentView && item">
      <div class="h-full w-full overflow-auto">
        <component :is="currentView.component" :item="item" />
      </div>
    </w-content>

    <w-content v-else class="flex items-center justify-center"> Error </w-content>
  </w-layout>
</template>
