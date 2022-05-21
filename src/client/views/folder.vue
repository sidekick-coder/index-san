<script setup lang="ts">
import { useCase } from '@/composables/use-case'
import { Item } from '@/types'
import { ref } from 'vue'

interface FolderChildren {
  name: string
  icon: string
  to: string
}

const props = defineProps({
  item: {
    type: Object as () => Item,
    required: true,
  },
})

const children = ref<FolderChildren[]>([])

async function addSubItems() {
  useCase<Item[]>('list-items', {
    workspaceId: props.item.workspaceId,
    path: props.item.path,
  })
    .then((data) => {
      data.forEach((item) => {
        children.value.push({
          name: item.name,
          icon: 'folder',
          to: `/${item.workspaceId}/${item.path}`,
        })
      })
    })
    .catch(console.error)
}

async function load() {
  children.value = []

  await addSubItems()
}

load()
</script>

<template>
  <div class="flex flex-wrap">
    <router-link v-for="child in children" :key="child.name" class="w-full" :to="child.to">
      <div class="list-item clickable border-b">
        <fa-icon :icon="child.icon" class="mr-4" />
        {{ child.name }}
      </div>
    </router-link>
  </div>
</template>
