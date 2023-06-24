import { MarkdownNodeArray, MarkdownNode } from '@language-kit/markdown'
import uniqueId from 'lodash/uniqueId'

export const key = Symbol('editor')

export function create() {
    const id = uniqueId('editor-')

    const nodes = ref(new MarkdownNodeArray())
    const selected = ref<MarkdownNode[]>([])

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

    // create a new node but don't add it to the editor
    function make() {
        const node = new MarkdownNode()

        node.meta.id = uniqueId('node-')

        node.meta.toolbarId = `${id}-toolbar-${node.meta.id}`

        return node
    }

    return reactive({
        id,
        nodes,
        selected,
        select,
        unselect,
        clear,
        make,
    })
}

export function provideEditor() {
    const editor = create()

    provide(key, editor)

    return editor
}

export function useEditor() {
    const editor = inject(key)

    if (!editor) {
        throw new Error('Editor not found')
    }

    return editor as ReturnType<typeof create>
}
