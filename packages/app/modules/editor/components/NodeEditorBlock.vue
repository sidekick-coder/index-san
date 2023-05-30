<script setup lang="ts">
import { Node } from '@language-kit/markdown'
import { useManger } from '../composable/nodes-manager'
import debounce from 'lodash/debounce'
import { onKeyDown, onKeyStroke, useFocusWithin } from '@vueuse/core'
import { useFocusList } from '../composable/focus-list'
import { NodeWithId } from '../types/node'
import { useNodeEditor } from '../composable/node-editor'

const props = defineProps({
    node: {
        type: Object as () => NodeWithId,
        required: true,
    },
})

const emit = defineEmits(['onSelect', 'onUnselect'])

// actions
const editor = useNodeEditor()

const root = ref<HTMLElement>()
const content = ref<HTMLElement>()
const isSelected = computed(() => editor.selectedBlockId === props.node.id)

const { focused } = useFocusWithin(root)

const keybindings = {
    ArrowDown: {
        preventDefault: true,
        handler: selectNextBlock,
        target: undefined,
    },
    ArrowUp: {
        preventDefault: true,
        handler: selectPreviousBlock,
        target: undefined,
    },
    // Backspace: {
    //     preventDefault: true,
    //     handler: deleteBlock,
    //     target: undefined,
    // },
    Enter: {
        preventDefault: true,
        handler: addNewBlock,
        target: content,
    },
}

function selectPreviousBlock() {
    if (!isSelected.value) return

    setTimeout(() => editor.move(-1), 100)
}

function selectNextBlock() {
    if (!isSelected.value) return

    setTimeout(() => editor.move(), 100)
}

function addNewBlock() {}

function deleteBlock() {
    // editor.remove(props.node.id)
}

Object.entries(keybindings).forEach(([key, action]) => {
    onKeyDown(
        key,
        (e) => {
            if (!isSelected.value) return

            if (action.preventDefault) {
                e.preventDefault()
            }

            action.handler()
        },
        { target: action.target }
    )
})

watch(focused, (focused) => {
    if (focused) {
        editor.select(props.node.id)
    }
})

watch(isSelected, (v) => {
    emit(v ? 'onSelect' : 'onUnselect')
})

onMounted(() => {
    editor.blocks.push({
        id: props.node.id,
    })
})

onUnmounted(() => {
    const index = editor.blocks.findIndex((block) => block.id === props.node.id)

    if (index === -1) return

    editor.blocks.splice(index, 1)
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
        :class="isSelected ? 'bg-b-secondary/50' : ''"
        tabindex="0"
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

                <v-card color="b-secondary" class="rounded">
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
