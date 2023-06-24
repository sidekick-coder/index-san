<script setup lang="ts">
import { MarkdownNode } from '@language-kit/markdown'
import { useEditor } from '../composables/editor'

// node model
const node = defineModel({
    type: MarkdownNode,
    required: true,
})

// selected
const editor = useEditor()

const selected = defineModel('selected', {
    type: Boolean as PropType<boolean | null>,
    default: null,
    local: true,
})

watch(
    editor.selected,
    (value) => {
        selected.value = value.includes(node.value)
    },
    { immediate: true }
)

watch(selected, (value) => {
    if (value === null) return

    if (value) {
        return editor.select(node.value)
    }

    editor.unselect(node.value)
})

// menu

const icon = defineProp<string>('icon', {
    type: String,
    default: 'grip-vertical',
})
</script>
<template>
    <div>
        <Teleport :to="`#${node.meta.toolbarId}`">
            <slot name="toolbar" />
        </Teleport>

        <div class="w-[40px] flex justify-center self-start">
            <v-btn
                mode="text"
                size="none"
                color="b-primary"
                class="h-12 text-sm opacity-0 group-hover:opacity-100"
            >
                <v-icon data-test-id="icon" :name="icon" />
            </v-btn>
        </div>

        <div class="flex-1">
            <slot />
        </div>
    </div>
</template>
