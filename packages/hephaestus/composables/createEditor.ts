import { MarkdownNode, MarkdownNodeArray, MarkdownParser } from '@language-kit/markdown'
import { ref, watch } from 'vue'

import debounce from 'lodash/debounce'

export interface EditorObserver {
    (args: any): void
}

export function createEditor(){
    const parser = new MarkdownParser()

    const text = ref('')
    const nodes = ref(new MarkdownNodeArray())

    function setNodes(){
        nodes.value = parser.toNodes(text.value)
    }

    watch(text, debounce(setNodes, 1000))

    return {
        text,
        nodes,
        parser
    }
}