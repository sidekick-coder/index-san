import { MarkdownNode, MarkdownNodeArray, MarkdownParser } from '@language-kit/markdown'
import { ref, watch } from 'vue'

import debounce from 'lodash/debounce'

export interface EditorObserver {
    (args: any): void
}

export function createEditor(){
    const parser = new MarkdownParser()
    const nodes = ref(new MarkdownNodeArray())

    function setNodes(text: string){
        nodes.value = parser.toNodes(text)
    }

    return {
        nodes,
        parser,
        setNodes
    }
}