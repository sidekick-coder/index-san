<script setup lang="ts">
import { useWorkspaceStore } from '../stores/workspace'
const store = useWorkspaceStore()
</script>
<template>
  <div class="p-10">
    <div v-if="!store.current">No items selected</div>

    <div v-else>
      {{ store.current }}
    </div>
  </div>
</template>
