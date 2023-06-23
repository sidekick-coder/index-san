<script setup lang="ts">
// model
const model = defineModel({
    type: String,
    default: '',
})

const editableAreaRef = ref<HTMLElement>()

const focused = ref(false)

function loadEditableArea() {
    if (!editableAreaRef.value) return

    editableAreaRef.value.innerHTML = model.value
}

function onInput() {
    if (!editableAreaRef.value) return

    model.value = editableAreaRef.value?.innerHTML ?? ''
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
</script>
<template>
    <div>
        <component :is="instance" v-if="showView" data-test-id="view-area" />
        <div
            ref="editableAreaRef"
            data-test-id="editable-area"
            contenteditable="true"
            :class="!focused && isDynamicRender ? 'opacity-0' : ''"
            @input="onInput"
            @focus="focused = true"
            @blur="focused = false"
        />
    </div>
</template>
