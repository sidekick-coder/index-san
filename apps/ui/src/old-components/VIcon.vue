<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        default: null,
    },
})

const style = computed(() => ({
    width: props.size,
    height: props.size,
}))
</script>
<template>
    <div class="inline-flex items-center">
        <Icon
            v-if="name.includes(':')"
            :icon="name"
            :style="style"
        />
        <fa-icon
            v-else
            :icon="name"
            :style="style"
        />
    </div>
</template>
