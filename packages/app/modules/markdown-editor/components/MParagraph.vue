<script setup lang="ts">
import MBlock from './MBlock.vue'
import MHtml from './MHtml.vue'
import { Node as MarkdownNode, MarkdownToken, NodeType, Parser } from '@language-kit/markdown'

// Props & Emit

const props = defineProps({
    modelValue: {
        type: Object as () => MarkdownNode,
        required: true,
    },
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
    get: () => {
        return props.modelValue
    },
    set(value: MarkdownNode) {
        emit('update:modelValue', value)
    },
})

const parser = new Parser()
const html = ref('')

function load() {
    const value = model.value.tokens
        .map((t) => t.value)
        .join('')
        .trim()

    const isEqual = value === html.value

    if (isEqual) return

    html.value = value
}

watch(model, load)

onMounted(load)

function update(newHtml: string) {
    html.value = newHtml

    const tokens = parser.toTokens(newHtml)

    const lastIndex = tokens.length - 1
    const breakLine = MarkdownToken.breakLine()

    tokens.splice(lastIndex, 0, breakLine as any)

    const node = new MarkdownNode({
        type: NodeType.Heading,
        tokens,
    })

    model.value = node
}
</script>

<template>
    <m-block>
        <m-html :model-value="html" @update:model-value="update" />
    </m-block>
</template>
