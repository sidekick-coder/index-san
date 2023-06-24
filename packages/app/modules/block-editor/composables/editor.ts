import { MarkdownNodeArray, MarkdownNode } from '@language-kit/markdown'
import uniqueId from 'lodash/uniqueId'

export const key = Symbol('editor')

interface Observer {
    event: string
    callback: (args: any) => void
}

export function create() {
    const id = uniqueId('editor-')

    const nodes = ref(new MarkdownNodeArray())
    const selected = ref<MarkdownNode[]>([])
    const observers = [] as Observer[]

    function select(node: MarkdownNode) {
        if (selected.value.includes(node)) {
            return
        }

        selected.value.push(node)
    }

    function unselect(node: MarkdownNode) {
        selected.value = selected.value.filter((n) => n !== node)
    }

    function clear() {
        nodes.value = new MarkdownNodeArray()

        selected.value = []
    }

    function create(node: MarkdownNode) {
        node.meta.id = uniqueId('node-')
        node.meta.toolbarId = `${id}-toolbar-${node.meta.id}`

        nodes.value.push(node)

        return node
    }

    function update(node: MarkdownNode) {
        const index = nodes.value.findIndex((n) => n.meta.id === node.meta.id)

        if (index === -1) {
            return
        }

        nodes.value[index] = node

        emit('update', { node })
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
        select,
        unselect,
        clear,
        create,
        update,
        on,
        emit,
    })
}

export function provideEditor() {
    const editor = create()

    provide(key, editor)

    return editor
}

export function useEditorOrCreate() {
    const editor = inject(key)

    if (editor) {
        return editor as ReturnType<typeof create>
    }

    return provideEditor()
}

export function useEditor() {
    const editor = inject(key)

    if (!editor) {
        throw new Error('Editor not found')
    }

    return editor as ReturnType<typeof create>
}
