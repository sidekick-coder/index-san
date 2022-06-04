<script setup lang="ts">
import lodash from 'lodash'

import { computed, defineAsyncComponent, ref, watch } from 'vue'

import { Item } from '@/types'
import { useCase } from '@/composables/use-case'

import { useLayoutStore } from '@/stores/layout'
import { useIndexSanPlugins } from '@/composables/use-index-san-plugins'

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

const layoutStore = useLayoutStore()

const item = ref<Item>()
const tabId = ref<string>()
const viewId = ref<string>()

const currentView = computed(() => views.find((view) => view.id === viewId.value))
const defaultViewId = computed(() => item.value?.metas?.view)

const suggestedViewId = computed(() => {
  if (item.value?.type === 'folder') {
    return 'folder'
  }

  if (item.value?.path.endsWith('.md')) {
    return 'editor'
  }

  if (/(.png|jpg)/.test(item.value?.path || '')) {
    return 'image'
  }

  return 'default'
})

const title = computed(() => {
  if (!item.value) return 'No items selected'

  const { name, metas } = item.value

  return metas?.displayName || name
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
    component: defineAsyncComponent(() => import('@/views/editor/index.vue')),
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

const tabs = [
  {
    id: 'views',
    icon: 'eye',
  },
  {
    id: 'directory',
    icon: 'folder',
  },
  {
    id: 'metas',
    icon: 'cog',
  },
]

async function load() {
  loading.value.item = true

  useIndexSanPlugins().then((component) =>
    views.push({
      id: 'custom',
      label: 'Custom',
      component,
    })
  )

  await useCase<Item>('show-item', {
    workspaceId: props.workspaceId,
    path: props.path === 'root' ? '' : props.path,
  })
    .then((data) => (item.value = data))
    .catch(console.error)
    .finally(() => {
      viewId.value = lodash.get(item.value, 'metas.view', suggestedViewId.value)

      setTimeout(() => (loading.value.item = false), 500)
    })
}

watch(props, load, {
  immediate: true,
})

async function setView(id: string) {
  loading.value.view = true

  viewId.value = id

  layoutStore.right = false

  setTimeout(() => (loading.value.view = false), 500)
}

function setTab(id?: string) {
  const tab = tabs.find((tab) => tab.id === id)

  if (id === tabId.value && layoutStore.right) {
    tabId.value = undefined
    layoutStore.right = false
    return
  }

  if (!tab) return

  tabId.value = tab.id
  layoutStore.right = true
}

async function setDefaultView(id: string) {
  await useCase('save-item-metadata', {
    workspaceId: props.workspaceId,
    path: props.path,
    data: {
      view: id,
    },
  })
    .then(() => {
      lodash.set(item, 'value.metas.view', id)
    })
    .catch(console.error)
}
</script>
<template>
  <w-layout use-percentage>
    <w-toolbar
      class="border-b h-[50px] flex justify-end z-10"
      color="white"
      :layout-ignore="['right']"
    >
      <button
        class="h-full w-[60px] hover:bg-gray-100 justify-self-start"
        @click="layoutStore.toggleLeft"
      >
        <fa-icon class="text-lg" icon="bars" />
      </button>

      <div class="justify-self-start mr-auto font-bold">
        {{ title }}
      </div>

      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="h-full w-[60px] hover:bg-gray-100"
        :class="[tab.id === tabId ? 'bg-gray-100' : 'bg-white']"
        @click="setTab(tab.id)"
      >
        <fa-icon class="text-lg" :icon="tab.icon" />
      </button>
    </w-toolbar>

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

    <w-drawer
      v-model="layoutStore.right"
      layout-id="right"
      class="border-l bg-white"
      width="[300px]"
      right
    >
      <s-directory-list v-if="tabId === 'directory'" :item="item" />

      <div v-if="tabId === 'views'">
        <div
          v-for="v in views"
          :key="v.id"
          class="list-item clickable"
          :class="[v.id === viewId ? 'bg-gray-100' : 'bg-white']"
          @click="setView(v.id)"
        >
          <div>{{ v.label }}</div>
          <div
            v-if="v.id === defaultViewId"
            class="ml-auto bg-accent px-2 py-1 rounded text-white text-xs"
          >
            Default
          </div>

          <div
            v-else
            class="ml-auto bg-gray-200 px-2 py-1 rounded actions text-xs"
            @click.stop="setDefaultView(v.id)"
          >
            Make default
          </div>
        </div>
      </div>

      <div v-if="tabId === 'metas'">
        <s-meta-editor :item="item" />
      </div>
    </w-drawer>
  </w-layout>
</template>
