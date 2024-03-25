import { editor } from 'monaco-editor'

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
