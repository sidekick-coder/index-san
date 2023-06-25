<script setup lang="ts">
import { MarkdownNodeParagraph } from '@language-kit/markdown'
import Block from './Block.vue'
import HTMLContentEditable from './HTMLContentEditable.vue'
import { createNodeParagraphFromHtml } from '../composables/helpers'
import { TokenType } from '@language-kit/lexer'

defineOptions({
    inheritAttrs: false,
})

const model = defineModel({
    type: MarkdownNodeParagraph,
    required: true,
})

const html = ref('')
const contentEditableRef = ref<InstanceType<typeof HTMLContentEditable>>()
const selected = ref(false)

const isEmpty = computed(() => {
    if (model.value.tokens.length > 3) return

    return model.value.tokens.every((token) =>
        [TokenType.BreakLine, TokenType.EndOfFile].includes(token.type as any)
    )
})

function load() {
    html.value = model.value.children
        .map((c) => c.toHtml())
        .join('')
        .replaceAll(' ', '&nbsp;')
}

function update() {
    const node = createNodeParagraphFromHtml(html.value)

    node.meta = model.value.meta

    model.value = node
}

watch(model, load, { immediate: true })

watch(selected, (value) => {
    if (!contentEditableRef.value) return

    if (!value) return

    contentEditableRef.value.focus()
})
</script>
<template>
    <block v-model="model" v-model:selected="selected" :class="isEmpty ? 'hidden' : ''">
        <HTMLContentEditable
            ref="contentEditableRef"
            v-model="html"
            @blur="update"
            @keydown.enter.prevent="update"
            @keydown.ctrl.s="update"
        />
    </block>
</template>
