<script setup lang="ts">
import { parseMarkdown } from '../composables/markdown'

import SChart from '@/modules/script/components/SChart.vue'

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
})

const view = {
    components: { SChart },
    template: parseMarkdown(props.content),
}
</script>

<template>
    <article class="is-markdown whitespace-pre-line leading-tight">
        <component :is="view" />
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
