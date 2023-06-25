<script setup lang="ts">
import { MarkdownNodeHeading } from '@language-kit/markdown'
import Block from './Block.vue'
import HTMLContentEditable from './HTMLContentEditable.vue'
import { convertHtmlToMarkdown } from '../composables/helpers'

defineOptions({
    inheritAttrs: false,
})

const model = defineModel({
    type: MarkdownNodeHeading,
    required: true,
})

const html = ref('')
const contentEditableRef = ref<InstanceType<typeof HTMLContentEditable>>()
const selected = ref(false)

function load() {
    html.value = model.value.toHtml().replaceAll(' ', '&nbsp;')
}

function update() {
    let markdown = convertHtmlToMarkdown(html.value)

    markdown = markdown.replace(/^<h\d>(.*)<\/h\d>$/, '$1')

    model.value.body = markdown

    model.value = model.value
}

watch([() => model.value.level, () => model.value.body], load, { immediate: true })

watch(selected, (value) => {
    if (!contentEditableRef.value) return

    if (!value) return

    contentEditableRef.value.focus()
})
</script>
<template>
    <block v-model="model" v-model:selected="selected">
        <HTMLContentEditable
            ref="contentEditableRef"
            v-model="html"
            @blur="update"
            @keydown.enter.prevent="update"
            @keydown.ctrl.s="update"
        />
    </block>
</template>
