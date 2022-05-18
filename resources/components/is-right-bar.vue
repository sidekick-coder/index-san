<script setup lang="ts">
import { useLayoutStore } from '../stores/layout'

const layoutStore = useLayoutStore()
</script>
<template>
  <w-drawer v-model="layoutStore.right" class="border-l" width="[300px]"> right </w-drawer>
</template>
