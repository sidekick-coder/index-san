<script setup lang="ts">
import { MarkdownNodeHeading, MarkdownParser } from '@language-kit/markdown'
import Block from './Block.vue'
import HTMLContentEditable from './HTMLContentEditable.vue'
import { convertHtmlToMarkdown } from '../composables/helpers'
import { Token } from '@language-kit/lexer'
import ToolbarBtn from './ToolbarBtn.vue'

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
const parser = new MarkdownParser()

function load() {
    let text = model.value.toText().replaceAll('#', '').replaceAll('\n', '')

    if (text.endsWith(' ')) {
        text = text.slice(0, -1) + '&nbsp;'
    }

    html.value = text
}

function update(level?: number) {
    const headingLevel = level ?? model.value.level

    let markdown = convertHtmlToMarkdown(html.value)

    markdown = markdown.replace(/^<h\d>(.*)<\/h\d>$/, '$1').trim()

    markdown = '#'.repeat(headingLevel) + ' ' + markdown

    const node = new MarkdownNodeHeading()

    node.level = headingLevel
    node.body = markdown.trim()
    node.meta = model.value.meta

    node.tokens = parser.toTokens(markdown, {
        includeEndOfFileToken: false,
    })

    node.tokens.unshift(Token.breakLine())
    node.tokens.push(Token.breakLine())

    model.value = node
}

watch([() => model.value.level, () => model.value.body], load, { immediate: true })

watch(selected, (value) => {
    if (!contentEditableRef.value) return

    if (!value) return

    contentEditableRef.value.focus()
})
</script>
<template>
    <block
        v-model="model"
        v-model:selected="selected"
        class="block-heading"
    >
        <template #dragger>
            <v-btn
                mode="text"
                size="none"
                class="py-1 text-t-secondary h-12"
                color="b-primary"
            >
                <v-icon
                    data-test-id="dragger-icon"
                    :name="`lucide:heading-${model.level}`"
                    class="text-lg"
                />
            </v-btn>
        </template>
        <template #toolbar>
            <ToolbarBtn
                v-for="n in 6"
                :key="n"
                :active="model.level === n"
                data-test-id="toggle-level-btn"
                @click="update(n)"
            >
                <v-icon
                    :name="`lucide:heading-${n}`"
                    class="mr-2 text-lg"
                />
            </ToolbarBtn>
        </template>

        <component :is="`h${model.level}`">
            <HTMLContentEditable
                ref="contentEditableRef"
                v-model="html"
                @blur="update()"
                @keydown.enter.prevent="update()"
                @keydown.ctrl.s="update()"
            />
        </component>
    </block>
</template>

<style lang="scss">
.block-heading {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        @apply font-bold;
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
}
</style>
