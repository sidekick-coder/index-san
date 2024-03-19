import * as monaco from 'monaco-editor'

export interface MonacoLanguageDefinition {
    id: string
    monarch?: monaco.languages.IMonarchLanguage
    completion?: monaco.languages.CompletionItemProvider
}

export function defineLanguage(value: MonacoLanguageDefinition) {
    return value
}

export function defineMonarch(value: MonacoLanguageDefinition['monarch']) {
    return value
}

export function defineCompletion(value: MonacoLanguageDefinition['completion']) {
    return value
}

export function registerLanguage(language: MonacoLanguageDefinition) {
    monaco.languages.register({
        id: language.id,
    })

    if (language.monarch) {
        monaco.languages.setMonarchTokensProvider(language.id, language.monarch)
    }

    if (language.completion) {
        monaco.languages.registerCompletionItemProvider(language.id, language.completion)
    }
}
