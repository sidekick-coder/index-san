<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { createBindings } from '@/composables/binding'
import { computed, ref, useAttrs, onMounted } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: '',
    },
    label: {
        type: String,
        default: '',
    },
    size: {
        type: String,
        default: 'md',
    },
    color: {
        type: String,
        default: 'accent',
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    flat: {
        type: Boolean,
        default: false,
    },
    tile: {
        type: Boolean,
        default: false,
    },
    rounded: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        default: 'text',
    },
    placeholder: {
        type: String,
        default: '',
    },
    autofocus: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const model = useVModel(props, 'modelValue', emit)

const attrs = useAttrs()

// input

const sizes = {
    sm: 'py-1 px-4 text-sm',
    md: 'py-2 px-4',
}

const inputColors = {
    default: {
        accent: {
            normal: 'outline outline-2 outline-lines',
            focus: 'outline-accent',
        },
        danger: {
            normal: 'outline outline-2 outline-lines',
            focus: 'outline-danger',
        },
        info: {
            normal: 'outline outline-2 outline-lines',
            focus: 'outline-info',
        },
    },
    flat: {
        accent: {
            normal: 'outline outline-1 outline-transparent hover:outline-accent',
            focus: '!outline-accent bg-accent/20',
        },
        danger: {
            normal: 'bg-transparent',
            focus: 'bg-danger/20',
        },
        info: {
            normal: 'bg-transparent',
            focus: 'bg-info/20',
        },
    },
}

const input = ref({
    isFocus: false,
})

function onFocus() {
    input.value.isFocus = true
    emit('focus')
}

function onBlur() {
    input.value.isFocus = false
    emit('blur')
}

const classes = computed(() => {
    const result: string[] = ['transition-all bg-transparent w-full flex']

    let color = inputColors.default[props.color]

    if (props.flat && color) {
        color = inputColors.flat[props.color]
    }

    if (!props.tile) {
        result.push(props.rounded ? 'rounded-full' : 'rounded-sm')
    }

    result.push(color ? color.normal : props.color)

    result.push(sizes[props.size] || props.size)

    if (input.value.isFocus && color) {
        result.push(color.focus)
    }

    return result
})

// label
const labelColors = {
    default: {
        accent: 'text-accent',
        danger: 'text-danger',
        info: 'text-info',
    },
}

const labelClasses = computed(() => {
    const result = ['text-t-secondary block font-bold text-sm mb-2']

    if (input.value.isFocus) {
        result.push(labelColors.default[props.color])
    }

    return result
})

// input attrs

const bindings = computed(() => createBindings(attrs, ['label', 'input', 'wrapper']))

// autofocus
const inputRef = ref<HTMLInputElement>()

onMounted(() => {
    if (props.autofocus) {
        inputRef.value?.focus()
    }
})
</script>
<template>
    <div v-bind="bindings.root" class="w-full relative">
        <div v-if="loading" class="absolute bottom-0 h-[1px] bg-accent w-full animate-pulse"></div>

        <label v-if="label" :for="label" :class="labelClasses" v-bind="bindings.label">
            {{ label }}
        </label>

        <div :class="classes" v-bind="bindings.wrapper">
            <slot name="prepend" />

            <input
                :id="label"
                ref="inputRef"
                v-model="model"
                :type="type"
                :placeholder="placeholder"
                :readonly="readonly"
                v-bind="bindings.input"
                class="bg-transparent outline-none grow w-full placeholder:text-t-secondary/50"
                @focus="onFocus"
                @blur="onBlur"
            />
            <slot name="append" />
        </div>
    </div>
</template>
