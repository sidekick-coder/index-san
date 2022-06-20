<script setup lang="ts">
import { useWorkspaceStore } from '../stores/workspace'
import { useLayoutStore } from '../stores/layout'
import { useElectron } from '@/composables/use-electron'
import { useCase } from '@/composables/use-case'

const electron = useElectron()
const store = useWorkspaceStore()
const layoutStore = useLayoutStore()

async function addWorkspace() {
  const request = await electron.showOpenDialog({
    properties: ['openDirectory'],
  })

  if (request.canceled) {
    return
  }

  const filepath = request.filePaths[0]
  const basename = filepath.split(/\/|\\/).pop()

  await useCase('create-workspace', {
    path: filepath,
    name: basename,
    displayName: basename,
  })

  await store.setWorkspaces()
}

store.setWorkspaces()
</script>

<template>
  <w-drawer
    v-model="layoutStore.left"
    width="[300px]"
    layout
    class="flex flex-wrap flex-col justify-start border-r"
  >
    <div class="list-item flex justify-between">
      <h1 class="text-2xl font-bold">Index-san</h1>
    </div>

    <div v-if="!store.workspaces.length" class="list-item">No items</div>

    <s-drawer-item
      v-for="workspace in store.workspaces"
      :key="workspace.id"
      :workspace-id="workspace.id"
      item-id="/"
      :to="`/${workspace.id}/root`"
      :label="workspace.displayName"
      :is-workspace="true"
    />

    <div
      class="list-item justify-self-end mt-auto cursor-pointer flex justify-between border-t hover:bg-gray-200"
      @click="addWorkspace"
    >
      Add workspace
      <fa-icon icon="plus" />
    </div>
  </w-drawer>
</template>
