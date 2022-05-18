<script setup lang="ts">
import { useWindowApi } from '../composables/api'
import { useWorkspaceStore } from '../stores/workspace'
import { useLayoutStore } from '../stores/layout'

const api = useWindowApi()
const workspaceStore = useWorkspaceStore()
const layoutStore = useLayoutStore()

async function addWorkspace() {
  await api.invoke('workspace:store')

  await workspaceStore.setWorkspaces()
}

workspaceStore.setWorkspaces()
</script>

<template>
  <w-drawer
    v-model="layoutStore.left"
    width="[300px]"
    layout
    class="flex flex-wrap flex-col justify-start border-r"
  >
    <div class="left-bar-item flex justify-between">
      <h1 class="text-2xl font-bold">Index-san</h1>
    </div>

    <div v-if="!workspaceStore.workspaces.length" class="left-bar-item">No items</div>

    <is-left-bar-item
      v-for="workspace in workspaceStore.workspaces"
      :key="workspace.path"
      :label="workspace.name"
      :workspace="workspace.name"
      path="/"
    />

    <div
      class="left-bar-item justify-self-end mt-auto cursor-pointer flex justify-between border-t hover:bg-gray-200"
      @click="addWorkspace"
    >
      Add workspace
      <fa-icon icon="plus" />
    </div>
  </w-drawer>
</template>
