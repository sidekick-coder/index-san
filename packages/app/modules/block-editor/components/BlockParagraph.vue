<script setup lang="ts">
import { MarkdownNodeParagraph } from '@language-kit/markdown'
import Block from './Block.vue'
import HTMLContentEditable from './HTMLContentEditable.vue'
import ToolbarTextFormat from './ToolbarTextFormat.vue'
import { convertMarkdownToHtml, createNodeParagraphFromHtml } from '../composables/helpers'
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
    let text = convertMarkdownToHtml(model.value.children.map((c) => c.toText()).join(''))

    if (text.endsWith(' ')) {
        text = text.slice(0, -1) + '&nbsp;'
    }

    html.value = text
}

function update() {
    const node = createNodeParagraphFromHtml(html.value)

    node.meta = model.value.meta

    model.value = node
}

function onToolbarTextFormat() {
    if (!contentEditableRef.value) return

    contentEditableRef.value.input()

    update()
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
        <template #toolbar>
            <ToolbarTextFormat @change="onToolbarTextFormat" />
        </template>

        <HTMLContentEditable
            ref="contentEditableRef"
            v-model="html"
            @blur="update"
            @keydown.enter.prevent="update"
            @keydown.ctrl.s="update"
        />
    </block>
</template>
