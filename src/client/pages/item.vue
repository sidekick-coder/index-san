<script setup lang="ts">
import lodash from 'lodash'

import { computed, defineAsyncComponent, ref, watch } from 'vue'

import { Item } from '../types'
import { useCase } from '../composables/use-case'
import { useRoute } from 'vue-router'

const props = defineProps({
  itemId: {
    type: String,
    required: true,
  },
})

const route = useRoute()

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

  return 'file-explorer'
})

const views = [
  {
    id: 'file-explorer',
    component: defineAsyncComponent(() => import('@/views/file-explorer.vue')),
  },
  {
    id: 'details',
    component: defineAsyncComponent(() => import('@/views/details.vue')),
  },
  {
    id: 'editor',
    component: defineAsyncComponent(() => import('@/views/simple-editor.vue')),
  },
  {
    id: 'image',
    component: defineAsyncComponent(() => import('@/views/image.vue')),
  },
  {
    id: 'database-table',
    component: defineAsyncComponent(() => import('@/views/database-table.vue')),
  },
]

async function load() {
  await useCase<Item>('show-item', {
    id: props.itemId,
  })
    .then((data) => (item.value = data))
    .catch(console.error)
    .finally(() => {
      const id = route.query.view || suggestedViewId.value

      viewId.value = lodash.get(item.value, 'view', id)
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
