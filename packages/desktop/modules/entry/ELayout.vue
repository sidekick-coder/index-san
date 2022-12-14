<script setup lang="ts">
import LLayout from '@/modules/layout/LLayout.vue'

import { useStore } from './store'

const store = useStore()
</script>

<template>
    <LLayout :hide-toolbar="!store.layout.toolbar" />
</template>
