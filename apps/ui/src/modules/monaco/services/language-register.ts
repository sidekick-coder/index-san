import type { MonacoLanguageDefinition } from '@/composables/defineMonacoLanguage'
import type { MonacoThemeDefinition } from '@/composables/defineMonacoTheme'
import { editor, languages } from 'monaco-editor'
// register all languages
const languageFiles = import.meta.glob<any>('@/modules/monaco/languages/*.ts', {
    eager: true
})

Object.entries(languageFiles)
    .forEach(([filename, languageModule]) => {
        const language = languageModule.default
        const name = filename.split('/').pop()?.replace('.ts', '')

        if (!language || !name) {
            return
        }

        console.debug(`[monaco] register language: ${name}`)

        languages.register({ id: name })

        languages.setMonarchTokensProvider(name, language)
    })