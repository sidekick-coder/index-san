import * as monaco from 'monaco-editor'

export interface MonacoLanguageDefinition {
    id: string
    monarch?: monaco.languages.IMonarchLanguage
    completion?: monaco.languages.CompletionItemProvider
}

export function defineMonacoLanguage(value: MonacoLanguageDefinition) {
    return value
}