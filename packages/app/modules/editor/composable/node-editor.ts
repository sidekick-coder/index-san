import { waitFor } from '@composables/utils'
import { NodeWithId } from '../types/node'
import { Token } from '@language-kit/lexer'
import { NodeType } from '@language-kit/markdown'

const key = Symbol('node-editor')

interface NodeEditorBlockArgs {
    id: string
}

interface Observers {
    name: string
    callback: (value: any) => void
}

export function create() {
    const setupContext = reactive({})
    const setupIsLoading = ref(false)
    const selectedBlockId = ref<string>()
    const hiddenIds = ref<string[]>([])
    const blocks = ref<NodeEditorBlockArgs[]>([])
    const observers = ref<Observers[]>([])

    function on(name: string, callback: (value: any) => void) {
        observers.value.push({ name, callback })
    }

    function off(name: string) {
        observers.value = observers.value.filter((o) => o.name !== name)
    }

    function emit(name: string, value: any) {
        observers.value.filter((o) => o.name === name).forEach((o) => o.callback(value))
    }

    function select(id: string) {
        selectedBlockId.value = id
    }

    function move(direction = 1) {
        if (!selectedBlockId.value) return

        const index = blocks.value.findIndex((b) => b.id === selectedBlockId.value)

        if (index === -1) return

        let moveNode: NodeEditorBlockArgs | undefined

        if (direction >= 1) {
            moveNode = blocks.value.find((b, i) => {
                if (hiddenIds.value.includes(b.id)) return false

                return i > index
            })
        }

        if (direction <= -1) {
            moveNode = blocks.value.findLast((b, i) => {
                if (hiddenIds.value.includes(b.id)) return false

                return i < index
            })
        }

        if (!moveNode) return

        select(moveNode.id)
    }

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

    function addNode(payload?: Pick<NodeWithId, 'type' | 'tokens'>) {
        let node = payload

        if (!node) {
            node = {
                type: NodeType.Paragraph,
                tokens: [Token.breakLine()],
            }
        }

        emit('add-node', node)
    }

    return reactive({
        selectedBlockId,
        hiddenIds,
        blocks,
        validate,
        setupContext,
        setupIsLoading,
        select,
        move,
        onLoadedContext,
        on,
        off,
        emit,
        addNode,
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
