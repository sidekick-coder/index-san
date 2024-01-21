<script setup lang="ts">
import { MarkdownNodeParagraph } from '@language-kit/markdown'
import { TokenType } from '@language-kit/lexer'
import type IsContentEditableVue from './IsContentEditable.vue';

defineOptions({
    inheritAttrs: false,
})

const model = defineModel({
    type: MarkdownNodeParagraph,
    required: true,
})

const markdownHelper = useMarkdownHelper()

const html = ref('')
const contentEditableRef = ref<InstanceType<typeof IsContentEditableVue>>()
const selected = ref(false)

const isEmpty = computed(() => {
    if (model.value.tokens.length > 3) return

    return model.value.tokens.every((token) =>
        [TokenType.BreakLine, TokenType.EndOfFile].includes(token.type as any)
    )
})

const showPlaceholder = computed(() => {
    if (!selected.value) return false

    if (isEmpty.value) return true

    return html.value === '&nbsp;'
})

function load() {
    let text = markdownHelper.convertMarkdownToHtml(model.value.children.map((c) => c.toText()).join(''))

    if (text.endsWith(' ')) {
        text = text.slice(0, -1) + '&nbsp;'
    }

    html.value = text
}

function update() {
    const node = markdownHelper.createNodeParagraphFromHtml(html.value)

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
    <IsBlockEditorBlock
        v-model="model"
        v-model:selected="selected"
        :class="isEmpty ? 'hidden' : ''"
        class="relative"
    >
        <template #toolbar>
            <IsBlockEditorToolbarTextFormat @change="onToolbarTextFormat" />
        </template>

        <div
            v-if="showPlaceholder"
            class="text-t-secondary absolute top-0 h-full flex items-center pointer-events-none pl-2"
        >
            {{ $t('blockParagraphPlaceholder') }}
        </div>

        <IsContentEditable
            ref="contentEditableRef"
            v-model="html"
            @blur="update"
            @keydown.enter.prevent="update"
            @keydown.ctrl.s="update"
        />
    </IsBlockEditorBlock>
</template>
