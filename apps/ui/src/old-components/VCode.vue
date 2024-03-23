<script setup lang="ts">
import hljs from 'highlight.js'
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: {
        type: [String, Object],
        default: '',
    },
    language: {
        type: String,
        default: 'shell',
    },
})

const content = ref('')

function getValue() {
    if (typeof props.modelValue === 'object') {
        return JSON.stringify(props.modelValue, null, '\t').trim()
    }

    return props.modelValue
}

function setHTML() {
    try {
        content.value = hljs.highlight(getValue(), { language: props.language }).value
    } catch (error) {
        content.value = error
    }
}

watch(props, setHTML, { deep: true, immediate: true })
</script>
<template>
    <pre class="flex">
        <code
:class="`language-${language}`"
v-html="content"
/>
    </pre>
</template>
