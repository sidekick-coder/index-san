<script setup lang="ts">
import { markdown } from '../composables/markdown'
import { onErrorCaptured, defineComponent, ref } from 'vue'

import SChart from '@/modules/script/components/SChart.vue'
import SOutput from '@/modules/script/components/SOutput.vue'

// Props & Emits

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
})

// render

const view = defineComponent({
    components: { SChart },
    template: markdown.parse(props.content),
})

// catch errors
const error = ref<any>()

onErrorCaptured((err) => {
    error.value = err.message

    return false
})
</script>

<template>
    <article class="is-markdown whitespace-pre-line leading-tight">
        <div v-if="error" class="bg-danger/70 rounded px-4 py-2">
            {{ error }}
        </div>
        <component :is="view" v-else />
    </article>
</template>

<style lang="scss">
.is-markdown {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        @apply font-bold;
        @apply my-4 first:mt-0;
    }

    h1 {
        @apply text-2xl;
    }

    h2 {
        @apply text-xl;
    }

    h3 {
        @apply text-lg;
    }

    p {
        @apply my-2;
    }

    pre {
        @apply bg-b-secondary text-sm p-4 rounded my-4;
    }

    ul {
        @apply flex flex-wrap py-4 pl-5;

        li {
            @apply w-full mb-2;
            @apply list-disc;
        }
    }
}
</style>
