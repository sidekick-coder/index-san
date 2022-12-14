<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
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
})

const emit = defineEmits(['update:modelValue'])

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
}

function onBlur() {
    input.value.isFocus = false
}

const classes = computed(() => {
    const result: string[] = ['transition-all bg-transparent w-full flex']

    let color = inputColors.default[props.color]

    if (props.flat) {
        color = inputColors.flat[props.color]
    }

    if (!props.tile) {
        result.push(props.rounded ? 'rounded-full' : 'rounded-sm')
    }

    result.push(color.normal)

    result.push(sizes[props.size] || props.size)

    if (input.value.isFocus) {
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

const bindings = computed(() => {
    const root = {}
    const label = {}
    const input = {}
    const wrapper = {}

    Object.keys(attrs).forEach((key) => {
        if (key.startsWith('input:')) {
            input[key.replace('input:', '')] = attrs[key]
            return
        }

        if (key.startsWith('label:')) {
            label[key.replace('label:', '')] = attrs[key]
            return
        }

        if (key.startsWith('wrapper:')) {
            wrapper[key.replace('wrapper:', '')] = attrs[key]
            return
        }

        root[key] = attrs[key]
    })

    return { root, wrapper, label, input }
})
</script>
<template>
    <div v-bind="bindings.root">
        <label v-if="label" :for="label" :class="labelClasses" v-bind="bindings.label">
            {{ label }}
        </label>

        <div :class="classes" v-bind="bindings.wrapper">
            <input
                :id="label"
                v-model="model"
                :type="type"
                :placeholder="placeholder"
                :readonly="readonly"
                v-bind="bindings.input"
                class="bg-transparent outline-none grow max-w-full"
                @focus="onFocus"
                @blur="onBlur"
            />
            <slot name="append" />
        </div>
    </div>
</template>
