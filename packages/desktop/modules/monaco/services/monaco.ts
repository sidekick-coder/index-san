import '../services/worker'

import * as monaco from 'monaco-editor'

import defaultTheme from '@/assets/themes/default.json'

import interfaces from './interfaces'

// define theme
monaco.editor.defineTheme('app-theme', defaultTheme as any)

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
    diagnosticCodesToIgnore: [1375, 1378],
})

const lib = {
    uri: 'ts:index-san/index.d.ts',
    source: interfaces,
}

monaco.languages.typescript.javascriptDefaults.addExtraLib(lib.uri, lib.source)

monaco.editor.createModel(lib.source, 'typescript', monaco.Uri.parse(lib.uri))

export function createMonaco(
    el: HTMLElement,
    options: monaco.editor.IStandaloneEditorConstructionOptions
) {
    return monaco.editor.create(el!, {
        ...options,
        theme: 'app-theme',
        automaticLayout: true,
        // value: model.value,
        // language: props.language,
        // readOnly: props.readonly,
        // minimap: { enabled: props.minimap },
        // padding: props.padding,
        // overviewRulerBorder: false,
        // lineNumbers: props.lineNumbers as any,
        // scrollbar: {
        //     verticalScrollbarSize: 10,
        //     horizontalScrollbarSize: 10,
        //     useShadows: false,
        //     horizontal: 'visible',
        //     vertical: 'visible',
        // },
    })
}
