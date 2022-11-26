<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    label: {
        type: String,
        default: '',
    },
    color: {
        type: String,
        default: 'accent',
    },
    flat: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue'])

const model = useVModel(props, 'modelValue', emit)

// input colors
const defaultColors = {
    accent: 'outline outline-2 outline-lines focus:outline focus:outline-accent',
    danger: 'bg-danger hover:bg-danger/75 text-t-primary',
    info: 'bg-info hover:bg-info/75 text-t-primary',
}

const flatColors = {
    accent: 'focus:outline-accent',
    danger: 'focus:outline-danger',
    info: 'focus:outline-info',
}

const colors = computed(() => {
    const result = defaultColors

    if (props.flat) {
        Object.assign(result, flatColors)
    }

    return result
})

const classes = computed(() => {
    const result: string[] = ['transition-all py-2 px-4 bg-transparent rounded w-full']

    result.push(colors.value[props.color])

    return result
})

// input state

const input = ref({
    isFocus: false,
})

function onFocus() {
    input.value.isFocus = true
}

function onBlur() {
    input.value.isFocus = false
}

// label colors
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
</script>
<template>
    <div class="w-full">
        <label v-if="label" :for="label" :class="labelClasses">{{ label }}</label>

        <input
            v-bind="$attrs"
            :id="label"
            v-model="model"
            :class="classes"
            @focus="onFocus"
            @blur="onBlur"
        />
    </div>
</template>
