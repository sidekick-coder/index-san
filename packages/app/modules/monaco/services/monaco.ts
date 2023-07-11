import '../services/worker'

import * as monaco from 'monaco-editor'

import mainTheme from '../themes/main'
import { RegisterThemeOptions } from '../composable/define-theme'

// define theme
monaco.editor.defineTheme(mainTheme.name, mainTheme)

// setting interfaces
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
})

monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    allowNonTsExtensions: true,
})

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    diagnosticCodesToIgnore: [1375, 1378, 1431, 1432, 7044, 2792],
})

export function registerTheme(options: RegisterThemeOptions) {
    monaco.editor.defineTheme(options.name, options)
}

// create editor
export function createMonaco(
    el: HTMLElement,
    options: monaco.editor.IStandaloneEditorConstructionOptions
) {
    return monaco.editor.create(el!, {
        theme: 'main',
        ...options,
        automaticLayout: true,
    })
}

// load libs
export interface MonacoLibs {
    uri: string
    // filepath: string
    source: string
}

interface RegisterItem {
    lib: monaco.IDisposable
    model: monaco.editor.ITextModel
}

const register: Map<string, RegisterItem> = new Map()

export function loadLibs(libs: MonacoLibs[]): () => any {
    libs.forEach((lib) => {
        if (register.has(lib.uri)) return

        console.debug(`[monaco] load lib: ${lib.uri}`)

        const libDisposable = monaco.languages.typescript.javascriptDefaults.addExtraLib(
            lib.uri,
            lib.source
        )

        const model = monaco.editor.createModel(lib.source, 'typescript', monaco.Uri.parse(lib.uri))

        register.set(lib.uri, {
            lib: libDisposable,
            model: model,
        })
    })

    return () => {
        libs.map((lib) => {
            const item = register.get(lib.uri)

            if (item) {
                item.lib.dispose()
                item.model.dispose()

                console.debug(`[monaco] dispose lib: ${lib.uri}`)

                register.delete(lib.uri)
            }
        })
    }
}
