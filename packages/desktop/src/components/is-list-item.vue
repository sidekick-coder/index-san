<script setup lang="ts">
import { computed, useAttrs } from 'vue'

const props = defineProps({
    to: {
        type: String,
        default: null,
    },
})

const attrs = useAttrs()

const classes = computed(() => {
    const result: string[] = ['w-full py-3 px-4 transition-all flex text-sm']

    if (attrs.onClick || props.to) {
        result.push('hover:bg-blue-500/5 hover:text-blue-500 cursor-pointer')
    }

    return result
})
</script>
<template>
    <router-link v-if="to" :to="to" :class="classes">
        <slot />
    </router-link>

    <div v-else :class="classes">
        <slot />
    </div>
</template>
