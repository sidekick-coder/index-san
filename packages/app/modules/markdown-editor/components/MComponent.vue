<script setup lang="ts">
import MBlock from './MBlock.vue'
import { Node as MarkdownNode } from '@language-kit/markdown'
import { TokenType } from '@language-kit/lexer'
import { useContext } from '../composable/context'
import { createComponentObject } from '@plugins/gc'

// Props & Emit

const props = defineProps({
    modelValue: {
        type: Object as () => MarkdownNode,
        required: true,
    },
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
    get: () => {
        return props.modelValue
    },
    set(value: MarkdownNode) {
        emit('update:modelValue', value)
    },
})

const context = useContext()
const loading = ref(false)
const componentData = shallowRef({
    template: null as null | string,
    components: createComponentObject(),
    props: {
        context: {
            type: Object,
            required: true,
        },
    },
})

function findAttrsRange() {
    const startIndex = 4
    const endIndex = model.value.tokens.findIndex((t, index) => {
        const prev = model.value.tokens[index - 1]

        if (t.type === TokenType.BreakLine && prev?.type === TokenType.WhiteSpace) {
            return true
        }

        return false
    })

    return [startIndex, endIndex]
}

function findAttrs() {
    const [startIndex, endIndex] = findAttrsRange()
    const lines: string[] = []
    const attrs: string[] = []

    let current = 0

    model.value.tokens.slice(startIndex, endIndex).forEach((t) => {
        if (t.type === TokenType.BreakLine) {
            current++
            return
        }

        if (!lines[current]) {
            lines[current] = ''
        }

        lines[current] += t.value
    })

    lines.forEach((line) => {
        // split first =
        let [name, value] = line.split(/=(.+)/)

        name = name.trim()

        if (!name) return

        if (name[0] === ':' && value[1] === '`') {
            // replace ${variable} to ${context.variable}
            value = value.replace(/\$\{([a-zA-Z0-9_]+)\}/g, (_, name) => {
                return `\${context.${name}}`
            })
        }

        if (name[0] === '@' && !value.includes('(')) {
            // replace method to context.method
            value = value.replace(/([a-zA-Z0-9_]+)/g, (_, name) => {
                return `context.${name}`
            })
        }

        if (name[0] === '@' && value.includes('(')) {
            // replace method(..args) to context.method(..args)
            value = value.replace(/([a-zA-Z0-9_]+)\(/g, (_, name) => {
                return `context.${name}(`
            })
        }

        attrs.push(`${name}=${value}`)
    })

    return attrs
}

function findContent() {
    const [, endAttrIndex] = findAttrsRange()

    const tokens = model.value.tokens.slice(endAttrIndex + 1)

    let content = tokens.map((t) => t.value).join('')

    // replace {{variable}} to {{context.variable}}
    content = content.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, name) => {
        return `{{context.${name}}}`
    })

    // replace {{ `...${variable}...` }} to {{ `...${context.variable}...` }}
    content = content.replace(/\{\{ `(.+)` \}\}/g, (_, content) => {
        return `{{ \`${content.replace(/\$\{([a-zA-Z0-9_]+)\}/g, (_, name) => {
            return `\${context.${name}}`
        })}\` }}`
    })

    return content.trim()
}

function load() {
    loading.value = true

    const globalComponents = {
        button: 'VBtn',
    }

    let name = model.value.tokens[3].value
    const attrs: string[] = findAttrs()
    const content = findContent()

    if (globalComponents[name]) {
        name = globalComponents[name]
    }

    const template = `<${name} ${attrs.join(' ')}>${content}</${name}>`

    componentData.value.template = template

    setTimeout(() => {
        loading.value = false
    }, 800)
}

watch(model, load)

onMounted(load)
</script>

<template>
    <m-block class="my-2">
        <div v-if="loading" class="text-t-secondary text-sm">Loading...</div>
        <component
            :is="componentData as any"
            v-else-if="componentData.template"
            :context="context"
        />
    </m-block>
</template>
