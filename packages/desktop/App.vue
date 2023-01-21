<script setup lang="ts">
import { watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useState } from './composables/state'

import NNotify from '@modules/notify/components/NNotify.vue'

// save last navigation
const router = useRouter()
const route = useRoute()
const loading = ref(false)

const lastRoute = useState('app:router:last', '/', {
    localStorage: true,
})

router.push(lastRoute.value)

loading.value = false

watch(
    () => route.path,
    (v) => (lastRoute.value = v)
)
</script>
<template>
    <n-notify />

    <router-view v-if="!loading" />
</template>
