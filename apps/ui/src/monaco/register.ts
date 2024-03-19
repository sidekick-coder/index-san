import * as monaco from 'monaco-editor'
import type { MonacoLanguageDefinition } from '@/composables/defineMonacoLanguage'
import type { MonacoThemeDefinition } from '@/composables/defineMonacoTheme'

// register all themes
const themeFiles = import.meta.glob<{ default: MonacoThemeDefinition }>('./themes/*.ts', {
    eager: true
})

Object.values(themeFiles)
    .map((f) => f.default)
    .filter((f) => !!f)
    .forEach((theme) => {
        monaco.editor.defineTheme(theme.name, theme)
    })

// register all languages
const languageFiles = import.meta.glob<{ default: MonacoLanguageDefinition }>('./languages/*.ts', {
    eager: true
})

Object.values(languageFiles)
    .map((f) => f.default)
    .filter((f) => !!f)
    .forEach((language) => {
        monaco.languages.register({
            id: language.id,
        })
    
        if (language.monarch) {
            monaco.languages.setMonarchTokensProvider(language.id, language.monarch)
        }
    
        if (language.completion) {
            monaco.languages.registerCompletionItemProvider(language.id, language.completion)
        }
    })