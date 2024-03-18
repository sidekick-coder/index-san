<script lang="ts" setup>

import type { AppPage } from '@/composables/defineAppPage'
import type { EntryMiddleware } from '@/composables/defineEntryMiddleware'

const middlewares = ref<EntryMiddleware[]>([])

</script>

<template>
    <div>file provider</div>
</template>
