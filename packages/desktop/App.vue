<script setup lang="ts">
import { watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useState } from './composables/state'

import NNotify from '@modules/notify/components/NNotify.vue'
import DDialog from '@modules/dialog/components/DDialog.vue'

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
    (v) => {
        const blackList = ['/welcome']

        if (blackList.includes(v)) return

        lastRoute.value = v
    }
)
</script>
<template>
    <n-notify />
    <d-dialog />

    <router-view v-if="!loading" />
</template>
