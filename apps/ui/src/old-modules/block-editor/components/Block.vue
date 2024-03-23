<script setup lang="ts">
import { MarkdownNode } from '@language-kit/markdown'
import { useEditor } from '../composables/editor'
import { syncRef, useFocusWithin, useKeyModifier } from '@vueuse/core'

// node model
const node = defineModel({
    type: MarkdownNode,
    required: true,
})

// selected

const root = ref<HTMLElement | null>(null)

const { focused } = useFocusWithin(root)
const isControlPressed = useKeyModifier('Control')
const isShiftPressed = useKeyModifier('Shift')

const isMultiSelectMode = computed(() => {
    return isControlPressed.value && isShiftPressed.value
})

const editor = useEditor()

const selected = defineModel('selected', {
    type: Boolean as PropType<boolean | null>,
    default: null,
    local: true,
})

const isSelectedInEditor = computed({
    get() {
        return editor.selected.some((n) => n.meta.id === node.value.meta.id)
    },
    set(value) {
        if (value) return editor.select(node.value)

        editor.unselect(node.value)
    },
})

syncRef(selected, isSelectedInEditor)

function onClick() {
    if (isMultiSelectMode.value) {
        editor.select(node.value)

        return
    }

    editor.select(node.value, true)
}

watch(focused, (value) => {
    if (value && !isMultiSelectMode.value) {
        isSelectedInEditor.value = true
    }
})

// menu

const icon = defineProp<string>('icon', {
    type: String,
    default: 'grip-vertical',
})
</script>
<template>
    <div
        ref="root"
        class="flex w-full min-h-[48px] items-center group hover:bg-b-secondary/50 pr-10"
        :class="isSelectedInEditor ? 'bg-b-secondary/50' : ''"
        @click="onClick"
    >
        <Teleport :to="`#${node.meta.toolbarId}`">
            <slot name="toolbar" />
        </Teleport>

        <div class="w-[40px] flex justify-center self-start">
            <slot name="dragger">
                <v-btn
                    mode="text"
                    size="none"
                    color="b-primary"
                    class="h-12 text-sm opacity-0 group-hover:opacity-100"
                    :class="isSelectedInEditor ? 'opacity-100' : ''"
                >
                    <v-icon
                        data-test-id="icon"
                        :name="icon"
                    />
                </v-btn>
            </slot>
        </div>

        <div
            class="flex-1 overflow-auto"
            :class="isMultiSelectMode ? 'pointer-events-none' : ''"
            :inert="isMultiSelectMode"
        >
            <slot />
        </div>
    </div>
</template>
