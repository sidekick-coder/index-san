import { MarkdownNodeArray, MarkdownNode } from '@language-kit/markdown'
import uniqueId from 'lodash/uniqueId'

export const key = Symbol('editor')

interface Observer {
    event: string
    callback: (args: any) => void
}

function create() {
    const id = uniqueId('editor-')

    const nodes = ref(new MarkdownNodeArray())
    const selected = ref<MarkdownNode[]>([])
    const observers = [] as Observer[]
    const toolbars = ref(new Map<string, HTMLElement>())

    function select(node: MarkdownNode, clear = false) {
        if (clear) {
            selected.value = []
        }

        const isSelected = selected.value.some((n) => n.meta.id === node.meta.id)

        if (isSelected) {
            return
        }

        selected.value.push(node)
    }

    function unselect(node: MarkdownNode) {
        selected.value = selected.value.filter((n) => n.meta.id !== node.meta.id)
    }

    function unselectAll() {
        selected.value = []
    }

    function clear() {
        nodes.value = new MarkdownNodeArray()

        selected.value = []
    }

    function add(node: MarkdownNode, silent = false) {
        node.meta.id = uniqueId('node-')
        node.meta.toolbarId = `${id}-toolbar-${node.meta.id}`

        nodes.value.push(node)

        if (!silent) {
            emit('add', { node })
        }

        return node
    }

    function addAll(payload: MarkdownNode[], silent = false) {
        payload.forEach((node) => {
            node.meta.id = uniqueId('node-')
            node.meta.toolbarId = `${id}-toolbar-${node.meta.id}`
        })

        nodes.value.push(...payload)

        if (!silent) {
            emit('add', { nodes: payload })
        }

        return payload
    }

    function destroy(node: MarkdownNode) {
        const index = nodes.value.findIndex((n) => n.meta.id === node.meta.id)

        if (index === -1) return

        nodes.value.splice(index, 1)

        emit('destroy', { node })
    }

    function destroySelected() {
        const ids = selected.value.map((n) => n.meta.id)

        const newNodes = nodes.value.filter((n) => !ids.includes(n.meta.id))

        nodes.value = new MarkdownNodeArray(...newNodes)

        emit('destroy', { nodes: selected.value })
    }

    function update(node: MarkdownNode) {
        const index = nodes.value.findIndex((n) => n.meta.id === node.meta.id)

        if (index === -1) {
            return
        }

        nodes.value[index] = node

        emit('update', { node })
    }

    function move(node: MarkdownNode, toIndex: number) {
        const index = nodes.value.findIndex((n) => n.meta.id === node.meta.id)

        if (index === -1) {
            return
        }

        nodes.value.splice(index, 1)

        nodes.value.splice(toIndex, 0, node)
    }

    function moveUp(node: MarkdownNode) {
        const index = nodes.value.findIndex((n) => n.meta.id === node.meta.id)
        const toIndex = index - 1

        if (index === -1 || toIndex < 0) {
            return
        }

        move(node, toIndex)

        emit('move')
    }

    function moveDown(node: MarkdownNode) {
        const index = nodes.value.findIndex((n) => n.meta.id === node.meta.id)
        const toIndex = index + 1

        if (index === -1) {
            return
        }

        move(node, toIndex)
    }

    function moveSelectedToUp() {
        const first = selected.value[0]

        if (!first) return

        const firstIndex = nodes.value.findIndex((n) => n.meta.id === first.meta.id)

        if (firstIndex === -1 || firstIndex === 0) {
            return
        }

        selected.value.forEach((node) => moveUp(node))
    }

    function moveSelectedToDown() {
        const last = selected.value.at(-1)

        if (!last) return

        const lastIndex = nodes.value.findIndex((n) => n.meta.id === last.meta.id)

        if (lastIndex === -1 || lastIndex === nodes.value.length - 1) {
            return
        }

        selected.value.forEach((node) => moveDown(node))
    }

    function on(event: string, callback: (args: any) => void) {
        observers.push({ event, callback })
    }

    function emit(event: string, args = {}) {
        observers.filter((o) => o.event === event).forEach((o) => o.callback(args))
    }

    return reactive({
        id,
        nodes,
        selected,
        toolbars,

        move,
        moveUp,
        moveDown,
        moveSelectedToUp,
        moveSelectedToDown,
        select,
        unselect,
        unselectAll,

        add,
        addAll,
        update,
        destroy,
        destroySelected,

        on,
        emit,

        clear,
    })
}

export function provideBlockEditor() {
    const editor = create()

    provide(key, editor)

    return editor
}

export function useBlockEditor(createIfNotExists = true) {
    const editor = inject(key)

    if (editor) {
        return editor as ReturnType<typeof create>
    }

    if (createIfNotExists) {
        return provideBlockEditor()
    }

    throw new Error('Block editor not found')
}
