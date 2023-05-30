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
    // setup
    const setupContext = reactive({})
    const setupIsLoading = ref(false)

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

    // nodes
    let nodesRef: Ref<NodeWithId[]> | undefined
    const nodes = computed(() => nodesRef?.value ?? [])

    function setNodesRef(_nodes: Ref<NodeWithId[]>) {
        nodesRef = _nodes
    }

    // events
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

    // selection
    const selectedBlockId = ref<string>()

    function select(id: string) {
        selectedBlockId.value = id
    }

    function selectByIndex(index: string) {
        selectedBlockId.value = nodes.value[index]?.id
    }

    function findNodeByIndex(index: number) {
        const length = nodes.value.length

        const moveIndex = ((index % length) + length) % length

        return nodes.value[moveIndex]
    }

    function move(direction = 1) {
        if (!selectedBlockId.value) return

        const index = nodes.value.findIndex((b) => b.id === selectedBlockId.value)

        if (index === -1) return

        let step = index + direction

        let moveNode = findNodeByIndex(step)

        if (moveNode.isComponent() && moveNode.name === 'setup') {
            step += direction
            moveNode = findNodeByIndex(step)
        }

        if (!moveNode) return

        select(moveNode.id)
    }

    function addNodeAt(index: number, payload?: Pick<NodeWithId, 'type' | 'tokens'>) {
        if (!payload) {
            payload = {
                type: NodeType.Paragraph,
                tokens: [Token.breakLine()],
            }
        }

        const node = new NodeWithId(payload)

        nodes.value.splice(index, 0, node)

        emit('add', node)

        return node
    }

    function addNodeAfter(node: NodeWithId, payload?: Pick<NodeWithId, 'type' | 'tokens'>) {
        const index = nodes.value.findIndex((n) => n.id === node.id)

        if (index === -1) return

        return addNodeAt(index + 1, payload)
    }

    function addNodeBefore(node: NodeWithId, payload?: Pick<NodeWithId, 'type' | 'tokens'>) {
        const index = nodes.value.findIndex((n) => n.id === node.id)

        if (index === -1) return

        return addNodeAt(index, payload)
    }

    function removeNode(node: NodeWithId) {
        const index = nodes.value.findIndex((n) => n.id === node.id)

        if (index === -1) return

        nodes.value.splice(index, 1)

        emit('remove', node)
    }

    return reactive({
        nodes,
        selectedBlockId,
        validate,
        setupContext,
        setupIsLoading,
        select,
        move,
        onLoadedContext,
        on,
        off,
        emit,
        setNodesRef,
        addNodeAfter,
        addNodeBefore,
        removeNode,
        selectByIndex,
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
