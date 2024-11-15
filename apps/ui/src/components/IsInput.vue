<script lang="ts" setup>
import uniqueId from 'lodash/uniqueId';
import type { Rule } from '~/composables/useRules'

// general
const className = defineProp<string>('class', {
    type: String,
    default: null,
})

const instance = getCurrentInstance()

const { set, classes } = useClassBuilder({ class: className })

set('base', 'relative group transition-colors duration-200 flex flex-col gap-y-2 w-full')

// label
const labelClassName = defineProp<string>('label-class', {
    type: String,
    default: null,
})

const {
    map: labelClassMap,
    set: setLabel,
    classes: labelClasses,
} = useClassBuilder({ class: labelClassName })

const label = defineProp<string>('label', {
    type: String,
    default: null,
})

labelClassMap.value.set(
    'base',
    'block font-bold text-sm text-body-100 cursor-pointer group-focus-within:text-primary-300 transition duration-200'
)

// input container
const inputContainerClassName = defineProp<string>('input-container-class', {
    type: String,
    default: null,
})

const { classes: inputContainerClasses, set: setContainer } = useClassBuilder({
    class: inputContainerClassName,
})

setContainer('base', [
    'flex items-center',
    'w-full',
    'border-2',
    'border-body-200',
    'rounded',
    'group-focus-within:border-primary-300',
    'transition duration-200',
])

// icons
const appendClassName = defineProp<string>('append-class', {
    type: String,
    default: null,
})

const { classes: appendClasses, set: setAppend } = useClassBuilder({
    class: appendClassName,
})

setAppend('base', ['px-4', 'text-body-100 group-focus-within:text-primary-300'])

// others
const loading = defineProp<boolean>('loading', {
    type: Boolean,
    default: false,
})

const id = defineProp<string>('id', {
    type: String,
    default: null,
})

const internalId = id.value || uniqueId() 

// icons
const iconLeft = defineProp<string>('iconLeft', {
    type: String,
    default: null,
})

const iconRight = defineProp<string>('iconRight', {
    type: String,
    default: null,
})

const emitClickIconRight = defineEmit('click:icon-right')
const emitClickIconLeft = defineEmit('click:icon-left')

// disabled
const disabled = defineProp<boolean>('disabled', {
    type: Boolean,
    default: false,
})

function setDisabled(value: boolean) {
    if (value) {
        setContainer('disabled', 'border-dashed')
        return
    }

    setContainer('disabled', '')
}

watch(disabled, setDisabled, {
    immediate: true,
})

// messages
interface Message {
    type: 'danger' | 'warning' | 'info' | 'success'
    message: string
}

const messages = ref<Message[]>([])

// validation
const validations = useValidation()

const model = defineModel<any>()

const rules = defineProp<Rule[]>('rules', {
    type: Array,
    default: () => [],
})

function validate() {
    let error: string | boolean = true

    setLabel('error', '')
    setAppend('error', '')
    setContainer('error', '')

    for (const rule of rules.value) {
        const result = rule(model.value)

        if (typeof result === 'string') {
            error = result
            break
        }
    }

    if (error === true) {
        messages.value = []
        return error
    }

    messages.value = [{ type: 'danger', message: error }]

    setAppend('error', '!text-danger-300')
    setLabel('error', '!text-danger-300')
    setContainer('error', '!border-danger-300')

    return false
}

watch(model, validate)

onMounted(() => {
    validations.value.push(validate)
})

// readonly
const readonly = defineProp<boolean>('readonly', {
    type: Boolean,
    default: false,
})

function setReadonly(value: boolean) {
    if (value) {
        setContainer('readonly', 'border-dashed')
        return
    }

    setContainer('readonly', '')
}

watch(readonly, setReadonly, {
    immediate: true,
})
</script>

<template>
    <div :class="classes">
        <label
            v-if="label"
            :for="internalId"
            :class="labelClasses"
        >{{ label }}</label>

        <div :class="inputContainerClasses">
            <div
                v-if="$slots.prepend || iconLeft"
                class="pl-4"
            >
                <slot name="prepend">
                    <is-icon
                        v-if="iconLeft"
                        :name="iconLeft"
                        class="text-lg text-body-100 transition-colors duration-200 group-focus-within:text-primary-300"
                        @click="emitClickIconLeft"
                    />
                </slot>
            </div>
            <slot :id="internalId" />

            <div
                v-if="loading || $slots.append || iconRight"
                :class="appendClasses"
            >
                <is-spinner
                    v-if="loading"
                    size="24"
                />
                <slot
                    v-else
                    name="append"
                >
                    <is-icon
                        v-if="iconRight"
                        :name="iconRight"
                        class="text-lg text-body-100 transition-colors duration-200 group-focus-within:text-primary-300"
                        :class="
                            instance?.vnode?.props?.['onClick:iconRight']
                                ? 'cursor-pointer'
                                : 'cursor-default'
                        "
                        @click="emitClickIconRight"
                    />
                </slot>
            </div>
        </div>

        <div
            v-for="message in messages"
            :key="message.message"
            class="py-1 text-xs text-danger-300"
        >
            {{ message.message }}
        </div>
    </div>
</template>
