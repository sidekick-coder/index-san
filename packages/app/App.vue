<script setup lang="ts">
import { watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useState } from './composables/state'

import NNotify from '@modules/notify/components/NNotify.vue'
import DDialog from '@modules/dialog/components/DDialog.vue'
import { useStore } from '@store/global'

// save last navigation
const router = useRouter()
const store = useStore()
const route = useRoute()
const loading = ref(false)

const getKey = () => `app:router:last:${store.workspace.currentId}`

let lastRoute = useState(getKey(), '/collections', { localStorage: true })

router.push(lastRoute.value)
watch(
    () => store.workspace.currentId,
    () => {
        lastRoute = useState(getKey(), '/collections', { localStorage: true })

        setTimeout(() => {
            router.push(lastRoute.value)
        }, 100)
    }
)

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
