import { waitFor } from '@composables/utils'

import NodeEditorBlock from '../components/NodeEditorBlock.vue'

const key = Symbol('node-editor')

export function create() {
    const setupContext = reactive({})
    const setupIsLoading = ref(false)
    const blocksRef = ref<InstanceType<typeof NodeEditorBlock>[]>([])

    function onLoadedContext() {
        return waitFor(() => setupIsLoading.value === false, 5000)
    }

    function validate(text: string) {
        const variableMatches = text.matchAll(/{{\s*([a-zA-Z0-9_]+)\s*}}/g)
        const functionMatches = text.matchAll(
            /{{\s*([a-zA-Z0-9_]+)\s*\(\s*([a-zA-Z0-9_,\s]+)\s*\)\s*}}/g
        )

        const variables = Array.from(variableMatches).map((m) => m[1])
        const functions = Array.from(functionMatches).map((m) => m[1])

        const variablesNotFound = variables.filter((v) => !Object.keys(setupContext).includes(v))
        const functionsNotFound = functions.filter((v) => !Object.keys(setupContext).includes(v))

        if (variablesNotFound.length) {
            return new Error(`Variable(s) not found: ${variablesNotFound.join(', ')}`)
        }

        if (functionsNotFound.length) {
            return new Error(`Function(s) not found: ${functionsNotFound.join(', ')}`)
        }

        return null
    }

    return reactive({
        blocksRef,
        validate,
        setupContext,
        setupIsLoading,
        onLoadedContext,
    })
}

export function provideNodeEditor() {
    const state = create()

    provide(key, state)

    return state
}

export function useNodeEditor() {
    return inject(key, create())
}
