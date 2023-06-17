<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useNodeEditor } from '../composable/node-editor'
import { NodeWithId } from '../types/node'
import NodeEditorToolbarBtn from './NodeEditorToolbarBtn.vue'
import { useTextSelection } from '@vueuse/core'

const tm = useI18n()
const editor = useNodeEditor()

const model = defineModel({
    type: NodeWithId,
    required: true,
})

const emit = defineEmits(['change'])

const textSelection = useTextSelection()

const actions = ref([
    {
        icon: 'bold',
        tag: 'strong',
        active: false,
        action: () => wrapOrUnwrapSelection('strong'),
    },
    {
        icon: 'italic',
        tag: 'em',
        active: false,
        action: () => wrapOrUnwrapSelection('em'),
    },
    {
        icon: 'strikethrough',
        tag: 's',
        active: false,
        action: () => wrapOrUnwrapSelection('s'),
    },
    {
        icon: 'underline',
        tag: 'u',
        active: false,
        action: () => wrapOrUnwrapSelection('u'),
    },
])

function findSelectionAncestorByTag(tag: string) {
    const selection = textSelection.selection.value

    if (!selection || selection.rangeCount === 0) return false

    const TAG_UPPERCASE = tag.toUpperCase()

    const range = selection?.getRangeAt(0)
    const text = range?.toString()

    if (!range || !text) return null

    let ancestor = range.commonAncestorContainer as HTMLElement

    while (ancestor && ancestor.tagName !== TAG_UPPERCASE) {
        ancestor = ancestor.parentElement as HTMLElement
    }

    return ancestor
}

function setSelectionActiveStates() {
    actions.value.forEach((action) => {
        const ancestor = findSelectionAncestorByTag(action.tag)

        action.active = !!ancestor && ancestor.tagName === action.tag.toUpperCase()
    })
}

function wrapOrUnwrapSelection(tag: string) {
    const selection = window.getSelection()

    if (!selection || selection.rangeCount === 0) return

    const TAG_UPPERCASE = tag.toUpperCase()
    const TAG_LOWERCASE = tag.toLowerCase()

    const range = selection?.getRangeAt(0)
    const text = range?.toString()

    if (!range || !text) return

    let ancestor = findSelectionAncestorByTag(tag) as HTMLElement

    if (!ancestor) {
        ancestor = range.commonAncestorContainer as HTMLElement
    }

    const isWrapped = ancestor && ancestor.tagName === TAG_UPPERCASE

    // Remove the tag if the selection is already wrapped
    if (isWrapped) {
        const parent = ancestor.parentElement as HTMLElement
        const content = range.extractContents()
        const nextRange = new Range()

        let start = Array.from(parent.childNodes).findIndex((node) => node === ancestor)
        let end = start + 1

        parent.insertBefore(content, ancestor)
        parent.removeChild(ancestor)

        start = Math.max(0, start)
        end = Math.min(parent.childNodes.length, end)

        nextRange.setStart(parent, start)
        nextRange.setEnd(parent, end)

        selection.removeAllRanges()
        selection.addRange(nextRange)
    }

    // Wrap the selection with tag
    if (!isWrapped) {
        // Wrap the selection with tag
        const strongElement = document.createElement(TAG_LOWERCASE)

        strongElement.innerText = text

        range.deleteContents()
        range.insertNode(strongElement)
        range.selectNodeContents(strongElement)
    }

    emit('change')
}

watch(textSelection.ranges, setSelectionActiveStates)
</script>
<template>
    <node-editor-toolbar-btn
        v-for="(btn, index) in actions"
        :key="index"
        :active="btn.active"
        @mousedown.prevent="btn.action"
    >
        <v-icon :name="btn.icon" />
    </node-editor-toolbar-btn>
</template>
