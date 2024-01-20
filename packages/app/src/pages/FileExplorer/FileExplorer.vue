<script lang="ts" setup>
import type { DriveEntry } from '@/composables/useDrive';

const { drive } = useDrive()


const entries = ref<DriveEntry[]>()


async function load(){
    console.log('load', drive.value)

    entries.value = await drive.value.list('/')
}

onMounted(load)

</script>
<template>
    <div>
        {{ entries }}
    </div>
</template>