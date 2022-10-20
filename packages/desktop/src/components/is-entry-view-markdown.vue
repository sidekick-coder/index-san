<script setup lang="ts">
import { useDirectoryEntry } from '@/composables/directory-entry'
import { ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
})

const repository = useDirectoryEntry(props.workspaceId)
const root = ref<HTMLTextAreaElement>()
const md = MarkdownIt({
    html: true,
    highlight: (str: string, lang: string) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value
            } catch (__) {
                console.error('highlight error')
            }
        }

        return ''
    }
})

const decoder = new TextDecoder('utf-8')

const content = ref('')
const preview = ref('mark')

async function load(){
    const contentBuffer = await repository.read(props.path)

    content.value = decoder.decode(contentBuffer)
}

load()

function setPreview(){
    preview.value = md.render(content.value)
}

const onChange = debounce(async () => {
    await repository.write(props.path, content.value)
}, 1000)

watch(content, onChange)
watch(content, setPreview)

</script>
<template>
    <div class="flex min-h-full w-full">
        <div class="min-h-full w-6/12 border-r">
            <is-textarea
                ref="root"
                v-model="content"
                class="h-[calc(100%_-_10px)] w-full bg-transparent outline-none"
                autofocus
                spellcheck
            />
        </div>
        
        <div class="min-h-full w-6/12 pl-10">
            <div class="whitespace-pre-line leading-tight" v-html="preview" />
        </div>

    </div>
</template>