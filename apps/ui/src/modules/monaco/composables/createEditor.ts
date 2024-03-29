import { editor } from 'monaco-editor'

export type EditorOptions = editor.IStandaloneEditorConstructionOptions

// create editor
export function createEditor(
    el: HTMLElement,
    options: editor.IStandaloneEditorConstructionOptions
) {
    return editor.create(el!, {
        theme: 'main',
        ...options,
        automaticLayout: true,
    })
}
