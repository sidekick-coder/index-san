<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { componentPlugin } from '@mdit-vue/plugin-component'

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
})

const md = MarkdownIt({
    html: true,
    // linkify: true,
    // typographer: true,
    highlight: (str: string, lang: string) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value
            } catch (__) {
                console.error('highlight error')
            }
        }

        return ''
    },
})

md.use(componentPlugin)

const view = {
    template: md.render(props.content),
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
        @apply my-4;
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
