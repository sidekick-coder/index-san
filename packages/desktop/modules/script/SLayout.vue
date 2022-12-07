<script setup lang="ts">
import LLayout from '@/modules/layout/LLayout.vue'
import { ref } from 'vue'
import { useStore } from './store'

const store = useStore()

const loading = ref(true)

store.setScrips().finally(() => (loading.value = false))
</script>

<template>
    <LLayout v-if="!loading" />
</template>
