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
// .ce-toolbar {
//     .ce-toolbar__content {
//         max-width: unset;
//     }

//     svg {
//         @apply text-t-primary;
//     }

//     .ce-toolbar__plus:hover {
//         @apply bg-b-primary;
//     }

//     .cdx-search-field input::placeholder {
//         @apply text-t-primary/50;
//     }

//     .cdx-search-field__icon .icon {
//         @apply text-t-primary;
//     }
//     .ce-popover {
//         @apply bg-b-primary bg-b-primary;
//     }

//     .ce-popover__item-icon {
//         @apply bg-b-primary bg-b-primary;
//     }

//     .ce-popover__item {
//         @apply bg-b-primary border bg-b-primary;
//     }

//     .ce-toolbar__settings-btn {
//         &:hover {
//             @apply bg-b-primary;
//         }
//     }

//     .ce-toolbar__actions {
//         padding-right: 20px;
//     }
// }
// .ce-inline-toolbar {
//     @apply bg-b-primary bg-b-primary;

//     button {
//         @apply text-t-primary;
//     }

//     input {
//         @apply bg-b-primary text-t-primary;

//         &::placeholder {
//             @apply text-t-primary/50;
//         }
//     }
// }

// .ce-block {
//     .ce-block__content {
//         @apply w-full;
//         max-width: unset;
//     }

//     &.ce-block--selected {
//         .ce-block__content {
//             @apply bg-b-primary px-4 -ml-4;
//         }
//     }

//     ::selection {
//         @apply bg-b-primary;
//     }
// }

// .ce-settings {
//     @apply bg-b-primary bg-b-primary;
// }
</style>
