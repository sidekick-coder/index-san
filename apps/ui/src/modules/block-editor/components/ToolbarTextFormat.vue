<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import ToolbarBtn from './ToolbarBtn.vue'

const emit = defineEmits(['change'])

function findSelection() {
    return window.getSelection()
}

function findRanges() {
    const selection = findSelection()

    if (!selection || selection.rangeCount === 0) return []

    const ranges: Range[] = []

    for (let i = 0; i < selection.rangeCount; i++) {
        ranges.push(selection.getRangeAt(i))
    }

    return ranges
}

function findSelectionAncestorByTag(tag: string) {
    const [range] = findRanges()

    if (!range) return null

    const TAG_UPPERCASE = tag.toUpperCase()

    const text = range?.toString()

    if (!range || !text) return null

    let ancestor = range.commonAncestorContainer as HTMLElement

    while (ancestor && ancestor.tagName !== TAG_UPPERCASE) {
        ancestor = ancestor.parentElement as HTMLElement
    }

    return ancestor
}

function wrapOrUnwrapSelection(tag: string) {
    const selection = window.getSelection()
    const [range] = findRanges()

    const text = range?.toString()

    if (!range || !text || !selection) return

    const TAG_UPPERCASE = tag.toUpperCase()
    const TAG_LOWERCASE = tag.toLowerCase()

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
        const wrapElement = document.createElement(TAG_LOWERCASE)

        wrapElement.appendChild(range.extractContents())

        range.deleteContents()
        range.insertNode(wrapElement)
        range.selectNodeContents(wrapElement)
    }

    emit('change')
}

// states

const actions = ref([
    {
        icon: 'bold',
        tag: 'strong',
        active: false,
        onClick: () => wrapOrUnwrapSelection('strong'),
    },
    {
        icon: 'italic',
        tag: 'em',
        active: false,
        onClick: () => wrapOrUnwrapSelection('em'),
    },
    {
        icon: 'strikethrough',
        tag: 's',
        active: false,
        onClick: () => wrapOrUnwrapSelection('s'),
    },
    {
        icon: 'underline',
        tag: 'u',
        active: false,
        onClick: () => wrapOrUnwrapSelection('u'),
    },
])

function onSelectionChange() {
    actions.value.forEach((action) => {
        const ancestor = findSelectionAncestorByTag(action.tag)

        action.active = !!ancestor && ancestor.tagName === action.tag.toUpperCase()
    })
}

useEventListener(document, 'selectionchange', onSelectionChange)
</script>
<template>
    <toolbar-btn
        v-for="action in actions"
        :key="action.tag"
        :active="action.active"
        :data-test-id="action.icon"
        @click="action.onClick"
    >
        <v-icon :name="action.icon" />
    </toolbar-btn>
</template>
