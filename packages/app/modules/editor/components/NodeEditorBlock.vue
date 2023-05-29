<script setup lang="ts">
import { Node } from '@language-kit/markdown'
import { useManger } from '../composable/nodes-manager'
import debounce from 'lodash/debounce'
import { onKeyDown, onKeyStroke } from '@vueuse/core'
import { useFocusList } from '../composable/focus-list'
import { NodeWithId } from '../types/node'

const props = defineProps({
    node: {
        type: Object as () => NodeWithId,
        required: true,
    },
})

const manager = useManger()

function deleteBlock() {
    manager.removeNode(props.node)
}

// focus
const isFocused = ref(false)
const content = ref<HTMLElement>()

const setIsFocused = debounce(() => {
    if (!content.value) return

    isFocused.value = content.value.contains(document.activeElement)
}, 50)

// key strokes
const root = ref<HTMLElement>()
const focusList = useFocusList('[data-block] [contenteditable]')

const focusBlock = debounce((direction = 1) => {
    if (!root.value) return

    if (!isFocused.value) return

    focusList.focus(direction)
}, 50)

onKeyStroke('ArrowDown', (e) => {
    e.preventDefault()
    focusBlock(1)
})

onKeyStroke('ArrowUp', (e) => {
    e.preventDefault()
    focusBlock(-1)
})

onMounted(() => {
    window.addEventListener('focus', setIsFocused, true)
})

onUnmounted(() => {
    window.removeEventListener('focus', setIsFocused)
})

// keybindings

// const manager = useManger()
// const focusList = useFocusList('[data-block] [contenteditable]')
// const cursor = useCursorHelper()

// const content = ref<HTMLElement>()

// function onBackspace(e: KeyboardEvent) {
//     if (!cursor.isCaretOnStart()) return

//     e.preventDefault()

//     focusList.focus(-1)

//     cursor.setCaretOnEnd()

//     manager.removeNode(model.value)
// }

// function onDeleteKeypress(e: KeyboardEvent) {
//     const haveText = model.value.toText().trim().length > 0

//     if (haveText) return

//     e.preventDefault()

//     manager.removeNode(model.value)
// }

// function addNewNode(e: KeyboardEvent) {
//     e.preventDefault()

//     const paragraph = new MarkdownNode({
//         type: NodeType.Paragraph,
//         tokens: [Token.breakLine()],
//     })

//     if (cursor.isCaretOnStart()) {
//         manager.addNodeBefore(model.value, paragraph)
//     }

//     if (!cursor.isCaretOnStart()) {
//         manager.addNodeAfter(model.value, paragraph)
//     }

//     setTimeout(() => {
//         focusList.focus(1)
//     }, 50)
// }

// onKeyStroke('Backspace', onBackspace, {
//     target: content,
// })

// onKeyStroke('Delete', onDeleteKeypress, {
//     target: content,
// })

// onKeyStroke('Enter', addNewNode, {
//     target: content,
// })
</script>

<template>
    <div
        ref="root"
        class="flex min-h-[50px] items-center group hover:bg-b-secondary/50 border-y border-b-secondary/25"
        :class="isFocused ? 'bg-b-secondary/50' : ''"
        data-block
    >
        <div class="w-[50px] flex justify-center">
            <v-menu offset-y close-on-content-click>
                <template #activator="{ attrs }">
                    <v-btn
                        v-bind="attrs"
                        mode="text"
                        size="none"
                        class="px-2 py-1 text-sm opacity-0 group-hover:opacity-100"
                    >
                        <v-icon name="grip-vertical" />
                    </v-btn>
                </template>

                <v-card color="b-secondary">
                    <v-list-item @click="deleteBlock">
                        <v-icon name="trash" class="mr-2" />

                        {{ $t('delete') }}
                    </v-list-item>
                    <slot name="menu" />
                </v-card>
            </v-menu>
        </div>

        <div ref="content" class="flex-1">
            <slot />
        </div>
    </div>
</template>
