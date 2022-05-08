<script setup lang="ts">
import { ref } from 'vue'
import { useWindowApi } from '../composables/api'
import { useWorkspaceStore, Workspace } from '../stores/workspace'

const api = useWindowApi()
const store = useWorkspaceStore()

const workspaces = ref<Workspace[]>([])

async function setWorkspaces() {
  const data = await api.invoke('workspace:index')

  workspaces.value = data
}

async function addItem() {
  await api.invoke('workspace:store')

  await setWorkspaces()
}

async function deleteWorkspace(path: string) {
  await api.invoke('workspace:destroy', {
    path,
  })

  await setWorkspaces()
}

setWorkspaces()
</script>

<template>
  <w-drawer layout width="[300px]" class="flex flex-wrap flex-col justify-start border-r">
    <div class="left-bar-item">
      <h1 class="text-2xl font-bold">Index-san</h1>
    </div>

    <div v-if="!workspaces.length" class="left-bar-item">No items</div>

    <div
      v-for="workspace in workspaces"
      :key="workspace.path"
      class="left-bar-item cursor-pointer"
      @click="store.setCurrent(workspace.path)"
    >
      <div class="w-8/12">
        {{ workspace.name }}
      </div>

      <w-btn
        class="w-4/12 action"
        text-size="xs"
        color="gray-100"
        @click.stop="deleteWorkspace(workspace.path)"
      >
        Delete
      </w-btn>
    </div>

    <div class="left-bar-item cursor-pointer" @click="addItem">+ Add new</div>
  </w-drawer>
</template>

<style>
.left-bar-item {
  @apply px-4 font-bold h-[50px] flex items-center transition-all hover:bg-gray-100;
}

.left-bar-item .action {
  @apply opacity-0;
}

.left-bar-item:hover .action {
  @apply opacity-100;
}
</style>
