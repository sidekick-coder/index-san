<script setup lang="ts">
import { useVModel } from 'vue-wind/composables/v-model'

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['update:modelValue', 'change'])
const model = useVModel(props, 'modelValue', emit)
const indentation = '    '

function onTabPress(event: KeyboardEvent) {
    const textarea = event.target as HTMLTextAreaElement

    if (!textarea) return

    const index = textarea.selectionStart

    const startText = model.value.slice(0, index)
    const endText = model.value.slice(index)

    textarea.value = [startText, indentation, endText].join('')
    model.value = [startText, indentation, endText].join('')

    textarea.selectionEnd = index + indentation.length
    textarea.selectionStart = index + indentation.length
}

function onShiftTabPress(event: KeyboardEvent) {
    const textarea = event.target as HTMLTextAreaElement

    if (!textarea) return

    const index = textarea.selectionStart
    const isIndentation = model.value.slice(index - indentation.length, index) === indentation

    const startText = model.value.slice(0, index - indentation.length)
    const endText = model.value.slice(index)

    if (!isIndentation) return

    textarea.value = [startText, endText].join('')
    model.value = [startText, endText].join('')

    textarea.selectionEnd = index - indentation.length
    textarea.selectionStart = index - indentation.length
}
</script>
<template>
    <textarea
        ref="root"
        v-model="model"
        @keydown.exact.tab.prevent="onTabPress"
        @keydown.shift.tab.prevent="onShiftTabPress"
    />
</template>
