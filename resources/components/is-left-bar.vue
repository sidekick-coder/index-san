<script setup lang="ts">
import { useWindowApi } from '../composables/api'
import { useWorkspaceStore } from '../stores/workspace'

const api = useWindowApi()
const store = useWorkspaceStore()

async function addWorkspace() {
  await api.invoke('workspace:store')

  await store.setWorkspaces()
}

store.setWorkspaces()
</script>

<template>
  <w-drawer width="[300px]" class="flex flex-wrap flex-col justify-start border-r">
    <div class="left-bar-item">
      <h1 class="text-2xl font-bold">Index-san</h1>
    </div>

    <div v-if="!store.workspaces.length" class="left-bar-item">No items</div>

    <is-left-bar-item
      v-for="workspace in store.workspaces"
      :key="workspace.path"
      :label="workspace.name"
      :path="workspace.path"
      :is-workspace="true"
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
