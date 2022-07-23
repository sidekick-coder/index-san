<script setup lang="ts">
import lodash from 'lodash'

import { computed, defineAsyncComponent, ref, watch } from 'vue'

import { Item } from '../types'
import { useCase } from '../composables/use-case'
import { useRoute } from 'vue-router'
import { useDatabaseStore } from '@/stories/database'

const props = defineProps({
  itemId: {
    type: String,
    required: true,
  },
})

const route = useRoute()
const database = useDatabaseStore()

const item = ref<Item>()
const viewId = ref<string>()

const dialogs = ref({
  database: false,
  item: false,
})

const loading = ref(false)

const currentView = computed(() => views.find((view) => view.id === viewId.value))

const isDatabaseTable = computed(() => database.tables.find((t) => t.id === props.itemId))

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
  loading.value = true

  await useCase<Item>('show-item', {
    id: props.itemId,
  })
    .then((data) => (item.value = data))
    .catch(console.error)
    .finally(() => {
      const id = route.query.view || suggestedViewId.value

      viewId.value = lodash.get(item.value, 'view', id)

      setTimeout(() => {
        loading.value = false
      }, 500)
    })
}

watch(props, load, {
  immediate: true,
})

function toggleView() {
  if (viewId.value === 'file-explorer' && isDatabaseTable.value) {
    viewId.value = 'database-table'
    return
  }

  if (item.value?.type === 'folder') {
    viewId.value = 'file-explorer'
    return
  }

  viewId.value = 'details'
}
</script>
<template>
  <w-layout use-percentage>
    <template v-if="currentView && item">
      <s-item-dialog v-model="dialogs.item" :parent-filepath="item.filepath" @submit="load" />
      <s-database-table-dialog v-model="dialogs.database" :filepath="item.filepath" />

      <w-toolbar color="white" class="border-b" height="[40px]">
        <div class="px-4 flex items-center">
          <button
            class="w-8 h-8 rounded-full hover:bg-gray-100 justify-self-start disabled:opacity-25"
            :disabled="item.type === 'file'"
            @click="dialogs.item = true"
          >
            <fa-icon class="text-sm" icon="plus" />
          </button>

          <button
            class="w-8 h-8 rounded-full hover:bg-gray-100 disabled:opacity-25"
            @click="toggleView"
          >
            <fa-icon class="text-sm" icon="eye" />
          </button>

          <button
            class="w-8 h-8 rounded-full hover:bg-gray-100 disabled:opacity-25"
            :disabled="item.type === 'file'"
            @click="dialogs.database = true"
          >
            <fa-icon class="text-sm" icon="database" />
          </button>

          <button
            class="w-8 h-8 rounded-full hover:bg-gray-100 justify-self-start disabled:opacity-25"
            @click="load"
          >
            <fa-icon class="text-sm" icon="refresh" />
          </button>

          <button
            class="w-8 h-8 rounded-full hover:bg-gray-100 justify-self-start disabled:opacity-25"
            :disabled="!$router.options.history.state.back"
            @click="$router.back"
          >
            <fa-icon class="text-sm" icon="chevron-left" />
          </button>

          <button
            class="w-8 h-8 rounded-full hover:bg-gray-100 justify-self-start disabled:opacity-25"
            :disabled="!$router.options.history.state.forward"
            @click="$router.forward"
          >
            <fa-icon class="text-sm" icon="chevron-right" />
          </button>

          <h1 class="ml-4 font-bold text-xs">{{ item?.filepath }}</h1>
        </div>
      </w-toolbar>

      <w-content>
        <div v-if="loading" class="h-full w-full flex items-center justify-center">
          <fa-icon class="text-2xl" icon="spinner" spin />
        </div>

        <div v-else class="h-full w-full overflow-auto">
          <component :is="currentView.component" :item="item" />
        </div>
      </w-content>
    </template>

    <w-content v-else class="flex items-center justify-center"> Error </w-content>
  </w-layout>
</template>
