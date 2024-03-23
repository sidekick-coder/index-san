import { MarkdownNodeArray, MarkdownParser } from '@language-kit/markdown'

export interface EditorObserver {
    (args: any): void
}

export function createEditor(){
    const parser = new MarkdownParser()
    const observers = new Map<string, EditorObserver[]>()
    
    const state = {
        text: '',
        nodes: new MarkdownNodeArray(),
    }

    function getText(){
        return state.text
    }

    function setText(text: string){
        state.text = text
    }

    function onUpdate(event: 'text' | 'nodes', cb: EditorObserver){
        const all = observers.get(event) || []

        all.push(cb)

        observers.set(event, all)
    }



    return {
        state,
        parser,

        getText,
        setText,
        onUpdate
    }
}