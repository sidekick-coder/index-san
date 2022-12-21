<script lang="ts">
export default { inheritAttrs: false }
</script>
<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { useVModel } from 'vue-wind/composables/v-model'

// Props & Emits

const props = defineProps({
    modelValue: {
        type: [String, Number, Object],
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
    readonly: {
        type: Boolean,
        default: false,
    },
    options: {
        type: Array as () => any[],
        default: () => [],
    },
    labelKey: {
        type: String,
        default: null,
    },
    valueKey: {
        type: String,
        default: null,
    },
    returnObject: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue'])

// Selection

const menu = ref(false)
const model = useVModel(props, 'modelValue', emit)

function getValue(option: any) {
    if (props.returnObject) {
        return option
    }

    if (props.valueKey) {
        return option[props.valueKey]
    }

    return option
}

function onSelect(option: any) {
    model.value = getValue(option)

    menu.value = false
}

// display options

function getLabel(option: any) {
    if (props.labelKey) {
        return option[props.labelKey]
    }

    return option
}

// Elements attrs

const attrs = useAttrs()

const bindings = computed(() => {
    const main = {}
    const card = {}
    const menu = {}

    Object.keys(attrs).forEach((key) => {
        if (key.startsWith('card:')) {
            card[key.replace('card:', '')] = attrs[key]
            return
        }

        if (key.startsWith('menu:')) {
            menu[key.replace('menu:', '')] = attrs[key]
            return
        }

        main[key] = attrs[key]
    })

    return {
        menu,
        main,
        card,
    }
})

// display label

const displayLabel = computed(() => {
    let label: any = model.value

    if (!label) {
        return label
    }

    if (props.returnObject) {
        return model.value[props.labelKey]
    }

    if (!props.labelKey || !props.valueKey) {
        return label
    }

    const option = props.options.find((o) => o[props.valueKey] === model.value)

    return option ? option[props.labelKey] : option
})

function onShowMenu(value: boolean) {
    if (props.readonly) return

    menu.value = value
}
</script>
<template>
    <v-menu
        :model-value="menu"
        max-height="132"
        v-bind="bindings.menu"
        close-on-content-click
        @update:model-value="onShowMenu"
    >
        <template #activator="{ attrs }">
            <v-input
                v-bind="{ ...attrs, ...bindings.main }"
                :model-value="displayLabel"
                :label="label"
                :color="color"
                :flat="flat"
                readonly
                class="cursor-pointer"
                input:class="cursor-pointer max-w-[calc(100%_-_32px)]"
            >
                <template #append>
                    <v-icon name="chevron-down" class="ml-auto text-t-secondary" />
                </template>
            </v-input>
        </template>

        <v-card color="b-secondary" v-bind="bindings.card">
            <template v-for="option in options" :key="option">
                <slot name="option" :option="option">
                    <v-list-item dark @click="onSelect(option)">
                        {{ getLabel(option) }}
                    </v-list-item>
                </slot>
            </template>
        </v-card>
    </v-menu>
</template>
