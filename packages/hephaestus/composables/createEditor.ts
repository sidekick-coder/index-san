import {  MarkdownNodeArray } from '@language-kit/markdown'
import { ref } from 'vue'
import { HephaestusMarkdownParser } from '../markdown/MarkdownParser'

export interface EditorObserver {
    (args: any): void
}

export function createEditor(){
    const parser = new HephaestusMarkdownParser() 
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
