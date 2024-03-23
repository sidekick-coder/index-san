<script setup lang="ts">
// model
const model = defineModel({
    type: String,
    default: '',
})

const emit = defineEmits(['blur'])

const editableAreaRef = ref<HTMLElement>()

const focused = ref(false)

function loadEditableArea() {
    if (!editableAreaRef.value) return

    if (model.value === editableAreaRef.value.innerHTML) return

    editableAreaRef.value.innerHTML = model.value
}

function onInput() {
    if (!editableAreaRef.value) return

    model.value = editableAreaRef.value?.innerHTML ?? ''
}

function onBlur() {
    focused.value = false

    emit('blur')
}

watch(model, loadEditableArea)

onMounted(loadEditableArea)

// view

const state = defineProp<Record<string, string>>('state', {
    type: Object,
    default: () => ({}),
})

const isDynamicRender = computed(() => {
    // include {{ }} in text
    return model.value.includes('{{') && model.value.includes('}}')
})

const loading = ref(false)

const instance = shallowRef(
    defineComponent({
        name: 'HTMLContentEditableInnerRenderer',
        setup: () => state.value,
        template: '<div></div>',
    })
)

const showView = computed(() => {
    return [!loading.value, isDynamicRender.value, !focused.value].every(Boolean)
})

function loadComponent() {
    if (!isDynamicRender.value) return

    loading.value = true

    instance.value = defineComponent({
        name: instance.value.name,
        setup: instance.value.setup,
        template: `<div>${model.value}</div>`,
    })

    loading.value = false
}

watch([model, state], loadComponent, { immediate: true })

// expose

function focus() {
    if (!editableAreaRef.value) return

    editableAreaRef.value.focus()
}

function blur() {
    if (!editableAreaRef.value) return

    editableAreaRef.value.blur()
}

defineExpose({
    focus,
    blur,
    input: onInput,
})
</script>
<template>
    <div class="flex w-full">
        <component
            :is="instance"
            v-if="showView"
            data-test-id="view-area"
        />
        <div
            ref="editableAreaRef"
            :class="!focused && isDynamicRender ? 'opacity-0' : ''"
            class="outline-none transition-opacity min-h-[20px] w-full"
            data-test-id="editable-area"
            contenteditable="true"
            @input="onInput"
            @focus="focused = true"
            @blur="onBlur"
        />
    </div>
</template>
