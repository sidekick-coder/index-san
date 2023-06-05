import { Ref } from 'vue'
import { waitFor } from '@composables/utils'
import { NodeWithId } from '../types/node'
import { Token, TokenArray } from '@language-kit/lexer'
import { MarkdownNodeNodeType } from '@language-kit/markdown'

import { findCircularItem } from '@composables/utils'

const key = Symbol('node-editor')

interface NodeEditorBlockArgs {
    id: string
}

interface Observers {
    name: string
    callback: (value: any) => void
}

export function create(nodesRef: Ref<NodeWithId[]>) {
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
    const currentSelectionId = ref<string[]>([])
    const currentSelection = computed(() =>
        nodesRef.value.filter((n) => currentSelectionId.value.includes(n.id))
    )

    function isSelected(node: NodeWithId) {
        return currentSelectionId.value.includes(node.id)
    }

    function selectNodes(...nodes: NodeWithId[]) {
        currentSelectionId.value = nodes.map((n) => n.id)
    }

    function findMoveNode(index: number, direction = 1) {
        const node = findCircularItem(nodesRef.value, index)

        if (node.isBreakLine()) {
            return findMoveNode(index + direction, direction)
        }

        if (node.isSetup()) {
            return findMoveNode(index + direction, direction)
        }

        return node
    }

    function selectPrevNode() {
        const first = currentSelection.value.at(0)

        if (!first) return

        const index = nodesRef.value.indexOf(first)

        const moveNode = findMoveNode(index - 1, -1)

        if (!moveNode) return

        selectNodes(moveNode)
    }

    function selectNextNode() {
        const last = currentSelection.value.at(-1)

        if (!last) return

        const index = nodesRef.value.indexOf(last)

        const moveNode = findMoveNode(index + 1)

        if (!moveNode) return

        selectNodes(moveNode)
    }

    // move nodes

    function moveNodeByIndex(fromIndex: number, toIndex: number) {
        const node = nodesRef.value[fromIndex]

        nodesRef.value.splice(fromIndex, 1)

        nodesRef.value.splice(toIndex, 0, node)
    }

    function moveNodeToUp(node: NodeWithId) {
        const fromIndex = nodesRef.value.findIndex((n) => n.id === node.id)

        if (fromIndex === -1) return

        const prevNode = findMoveNode(fromIndex - 1, -1)

        if (!prevNode) return

        const toIndex = nodesRef.value.indexOf(prevNode)

        if (toIndex === -1) return

        moveNodeByIndex(fromIndex, toIndex)
    }

    function moveNodeToDown(node: NodeWithId) {
        const fromIndex = nodesRef.value.findIndex((n) => n.id === node.id)

        if (fromIndex === -1) return

        const nextNode = findMoveNode(fromIndex + 1)

        if (!nextNode) return

        const toIndex = nodesRef.value.indexOf(nextNode)

        if (toIndex === -1) return

        moveNodeByIndex(fromIndex, toIndex)
    }

    function moveSelectedNodesToUp() {
        currentSelection.value.forEach((node) => moveNodeToUp(node))
    }

    function moveSelectedNodesToDown() {
        currentSelection.value.reverse().forEach((node) => moveNodeToDown(node))
    }

    // crud
    function addNodeAt(index: number, payload?: Pick<NodeWithId, 'type' | 'tokens'>) {
        if (!payload) {
            payload = {
                type: MarkdownNodeNodeType.Paragraph,
                tokens: new TokenArray(Token.breakLine()),
            }
        }

        const node = new NodeWithId(payload)

        nodesRef.value.splice(index, 0, node)

        emit('add', node)

        return node
    }

    function addNodeAfter(node: NodeWithId, payload?: Pick<NodeWithId, 'type' | 'tokens'>) {
        const index = nodesRef.value.findIndex((n) => n.id === node.id)

        if (index === -1) return

        return addNodeAt(index + 1, payload)
    }

    function addNodeBefore(node: NodeWithId, payload?: Pick<NodeWithId, 'type' | 'tokens'>) {
        const index = nodesRef.value.findIndex((n) => n.id === node.id)

        if (index === -1) return

        return addNodeAt(index, payload)
    }

    function deleteNodes(...nodes: NodeWithId[]) {
        nodesRef.value = nodesRef.value.filter((n) => !nodes.includes(n))

        emit('remove', nodes)
    }

    function deleteSelectedNodes() {
        deleteNodes(...currentSelection.value)
    }

    return reactive({
        // general
        nodesRef,

        // setup

        validate,
        setupContext,
        onLoadedContext,
        setupIsLoading,

        // section
        currentSelectionId,
        currentSelection,
        isSelected,
        selectNodes,
        selectNextNode,
        selectPrevNode,

        // move
        moveNodeByIndex,
        moveNodeToUp,
        moveNodeToDown,
        moveSelectedNodesToUp,
        moveSelectedNodesToDown,

        // crud
        addNodeAfter,
        addNodeBefore,

        deleteSelectedNodes,
        deleteNodes,

        // events
        on,
        off,
        emit,
    })
}

export function provideNodeEditor(nodesRef: Ref<NodeWithId[]>) {
    const state = create(nodesRef)

    provide(key, state)

    return state
}

export function useNodeEditor() {
    return inject(key, create(ref([])))
}
