<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import Toggle from 'editorjs-toggle-block'
import DragDrop from 'editorjs-drag-drop'

const props = defineProps({
    content: {
        type: Object as () => EditorJS.OutputData,
        default: null,
    },
})

const emit = defineEmits(['save'])

const root = ref<HTMLElement>()
const editor = ref<EditorJS>()

async function onChange() {
    if (!editor.value) return

    const data = await editor.value.save()

    emit('save', data)
}

async function load() {
    editor.value = new EditorJS({
        holder: root.value,
        onChange,
        minHeight: 0,
        tools: {
            header: Header,
            toggle: Toggle,
        },
    })

    await editor.value.isReady

    new DragDrop(editor.value)

    if (props.content) {
        editor.value.render(props.content)
    }
}

onMounted(load)

onUnmounted(() => editor.value?.destroy())
</script>

<template>
    <div ref="root" class="w-full" />
</template>

<style lang="scss">
.ce-toolbar {
    .ce-toolbar__content {
        max-width: unset;
    }

    svg {
        @apply text-white;
    }

    .ce-toolbar__plus:hover {
        @apply bg-zinc-700;
    }

    .cdx-search-field input::placeholder {
        @apply text-white/50;
    }

    .cdx-search-field__icon .icon {
        @apply text-white;
    }
    .ce-popover {
        @apply bg-zinc-700 border-zinc-500;
    }

    .ce-popover__item-icon {
        @apply bg-zinc-700 border-zinc-500;
    }

    .ce-popover__item {
        @apply bg-zinc-500 border border-zinc-500;
    }

    .ce-toolbar__settings-btn {
        &:hover {
            @apply bg-zinc-500;
        }
    }

    .ce-toolbar__actions {
        padding-right: 20px;
    }
}
.ce-inline-toolbar {
    @apply bg-zinc-700 border-zinc-500;

    button {
        @apply text-white;
    }

    input {
        @apply bg-zinc-700 text-white;

        &::placeholder {
            @apply text-white/50;
        }
    }
}

.ce-block {
    .ce-block__content {
        @apply w-full;
        max-width: unset;
    }

    &.ce-block--selected {
        .ce-block__content {
            @apply bg-zinc-800 px-4 -ml-4;
        }
    }

    ::selection {
        @apply bg-zinc-700;
    }
}

.ce-settings {
    @apply bg-zinc-700 border-zinc-500;
}
</style>
