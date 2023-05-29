import type { NodeWithId } from '../types/node'

const key = Symbol('editor:nodes')

interface Observer {
    name: string
    callback: () => void
}

function create() {
    const nodes = ref<NodeWithId[]>([])

    const observers: Observer[] = []

    function on(name: string, callback: () => void) {
        observers.push({ name, callback })
    }
    function emit(name: string) {
        observers.filter((o) => o.name === name).forEach((o) => o.callback())
    }

    function updateNodeByIndex(index: number, node: NodeWithId) {
        nodes.value[index] = node
    }

    function removeNode(node: NodeWithId) {
        const index = nodes.value.indexOf(node)

        if (index === -1) return

        nodes.value.splice(index, 1)

        emit('remove')
    }

    function addNode(index: number, node: NodeWithId) {
        nodes.value.splice(index, 0, node)

        emit('add')
    }

    function addNodeBefore(node: NodeWithId, before: NodeWithId) {
        const index = nodes.value.indexOf(node)

        if (index === -1) return

        addNode(index - 1, before)
    }

    function addNodeAfter(node: NodeWithId, after: NodeWithId) {
        const index = nodes.value.indexOf(node)

        if (index === -1) return

        addNode(index + 1, after)
    }

    return reactive({
        nodes,
        on,
        emit,
        updateNodeByIndex,
        addNode,
        addNodeAfter,
        addNodeBefore,
        removeNode,
    })
}

export function provideManager() {
    const state = create()

    provide(key, state)

    return state
}

export function useManger() {
    return inject(key, create())
}
