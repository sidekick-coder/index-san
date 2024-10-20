<script setup lang="ts">
import xor from 'lodash/xor'

const model = defineModel({
    type: Boolean,
    default: false,
})

const modelMultiple = defineModel('multiple', {
    type: Array as unknown as PropType<any[]>,
    default: () => [],
})

const label = defineProp('label', {
    type: String
})

const itemValue = defineProp('itemValue', {
    type: String
})

const readonly = defineProp('readonly', {
    type: Boolean
})

const loading = defineProp('loading', {
    type: Boolean
})

const isSelected = computed(() => {
    if (itemValue.value && modelMultiple.value.includes(itemValue.value)) {
        return true
    }

    return model.value
})

function onClick() {
    if (readonly.value) return

    model.value = !model.value

    modelMultiple.value = xor(modelMultiple.value, [itemValue.value])
}

// size
const iconClass = defineProp<string>('iconClass', {
    type: String,
    default: '',
})

const size = defineProp<string>('size', {
    type: String,
    default: 'md',
})

const { set: setIcon, classes: iconClasses } = useClassBuilder({ class: iconClass })

function setSize() {
    const options: Record<string, typeof size.value> = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-4xl',
    }

    setIcon('size', options[size.value])
}

watch(size, setSize, { immediate: true })
</script>
<template>
    <label
        class="flex cursor-pointer items-center gap-x-2 py-2"
        :class="[loading ? 'opacity-75' : '', label ? 'w-full' : '']"
        tabindex="0"
        @click.prevent="onClick"
        @keydown.enter="onClick"
    >
        <is-spinner v-if="loading" />

        <is-icon
            v-else
            :name="isSelected ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'"
            :class="[isSelected ? 'text-body-0' : 'text-body-100', iconClasses]"
        />

        <slot
            v-if="label || $slots.label"
            name="label"
        >
            <span class="mr-auto font-medium text-body-100">{{ label }}</span>
        </slot>
    </label>
</template>
