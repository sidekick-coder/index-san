<script setup lang="ts">
import { Node } from '@language-kit/markdown'
import { useManger } from '../composable/nodes-manager'
import debounce from 'lodash/debounce'
import { onKeyDown, onKeyStroke, useFocusWithin } from '@vueuse/core'
import { useFocusList } from '../composable/focus-list'
import { NodeWithId } from '../types/node'
import { useNodeEditor } from '../composable/node-editor'
import { useI18n } from 'vue-i18n'
import upperFirst from 'lodash/upperFirst'
import lowerCase from 'lodash/lowerCase'

type KeybindingNames = keyof typeof keybindings

const props = defineProps({
    node: {
        type: Object as () => NodeWithId,
        required: true,
    },
    disableKeybindings: {
        type: [Boolean, Array] as PropType<boolean | KeybindingNames[]>,
        default: false,
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
    Backspace: {
        preventDefault: true,
        handler: deleteBlock,
        target: undefined,
    },
    Delete: {
        preventDefault: true,
        handler: deleteBlock,
        target: undefined,
    },
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

function addNewBlock() {
    const created = editor.addNodeAfter(props.node)

    if (!created) return

    setTimeout(() => editor.select(created.id), 100)
}

function deleteBlock(direction?: number) {
    if (editor.selectedBlockId === props.node.id) {
        editor.move(direction)
    }

    editor.removeNode(props.node)
}

Object.entries(keybindings).forEach(([key, action]) => {
    const disableKeybindings = props.disableKeybindings

    if (disableKeybindings === true) return

    if (Array.isArray(disableKeybindings) && disableKeybindings.includes(key as KeybindingNames)) {
        return
    }

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

defineExpose({
    delete: deleteBlock,
})

// menu options

const tm = useI18n()

const options = [
    {
        icon: 'trash',
        label: tm.t('deleteEntity', [tm.t('block')]),
        handler: deleteBlock,
    },
    {
        icon: 'plus',
        label: tm.t('addBlockAbove'),
        handler: () => editor.addNodeBefore(props.node),
    },
    {
        icon: 'plus',
        label: tm.t('addBlockBelow'),
        handler: () => editor.addNodeAfter(props.node),
    },
]
</script>

<template>
    <div
        ref="root"
        class="flex min-h-[50px] items-center group hover:bg-b-secondary/50 border-y border-b-secondary/25"
        :class="isSelected ? 'bg-b-secondary/50' : ''"
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
                    <v-list-item
                        v-for="(option, index) in options"
                        :key="index"
                        size="xs"
                        @click="option.handler"
                    >
                        <v-icon :name="option.icon" class="mr-2" />

                        {{ upperFirst(lowerCase(option.label)) }}
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
