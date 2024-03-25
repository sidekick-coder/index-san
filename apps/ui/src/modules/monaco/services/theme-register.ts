
import * as monaco from 'monaco-editor'
// define theme
monaco.editor.defineTheme('default', {
    base: 'vs-dark',
    inherit: true,
    rules: [
        {
            background: '18181B',
            token: '',
        },
        {
            foreground: '0c562b',
            token: 'comment',
        },
        {
            foreground: 'feeca0',
            token: 'string',
        },
        {
            foreground: 'bd93f9',
            token: 'constant.numeric',
        },
        {
            foreground: 'bd93f9',
            token: 'constant.language',
        },
        {
            foreground: 'bd93f9',
            token: 'constant.character',
        },
        {
            foreground: 'bd93f9',
            token: 'constant.other',
        },
        {
            foreground: 'ffb86c',
            token: 'variable.other.readwrite.instance',
        },
        {
            foreground: 'be74fd',
            token: 'constant.character.escaped',
        },
        {
            foreground: 'be74fd',
            token: 'constant.character.escape',
        },
        {
            foreground: 'be74fd',
            token: 'string source',
        },
        {
            foreground: 'be74fd',
            token: 'string source.ruby',
        },
        {
            foreground: 'be74fd',
            token: 'keyword',
        },
        {
            foreground: 'be74fd',
            token: 'storage',
        },
        {
            foreground: '8be9fd',
            fontStyle: 'italic',
            token: 'storage.type',
        },
        {
            foreground: '50fa7b',
            fontStyle: 'underline',
            token: 'entity.name.class',
        },
        {
            foreground: '50fa7b',
            fontStyle: 'italic underline',
            token: 'entity.other.inherited-class',
        },
        {
            foreground: '50fa7b',
            token: 'entity.name.function',
        },
        {
            foreground: 'ffb86c',
            fontStyle: 'italic',
            token: 'variable.parameter',
        },
        {
            foreground: 'be74fd',
            token: 'entity.name.tag',
        },
        {
            foreground: '50fa7b',
            token: 'entity.other.attribute-name',
        },
        {
            foreground: '8be9fd',
            token: 'support.function',
        },
        {
            foreground: '6be5fd',
            token: 'support.constant',
        },
        {
            foreground: '66d9ef',
            fontStyle: ' italic',
            token: 'support.type',
        },
        {
            foreground: '66d9ef',
            fontStyle: ' italic',
            token: 'support.class',
        },
        {
            foreground: 'f8f8f0',
            background: 'be74fd',
            token: 'invalid',
        },
        {
            foreground: 'f8f8f0',
            background: 'bd93f9',
            token: 'invalid.deprecated',
        },
        {
            foreground: '149249',
            token: 'variable.source',
        },
        {
            foreground: 'cfcfc2',
            token: 'meta.structure.dictionary.json string.quoted.double.json',
        },
        {
            foreground: '6272a4',
            token: 'meta.diff',
        },
        {
            foreground: '6272a4',
            token: 'meta.diff.header',
        },
        {
            foreground: 'be74fd',
            token: 'markup.deleted',
        },
        {
            foreground: '50fa7b',
            token: 'markup.inserted',
        },
        {
            foreground: 'e6db74',
            token: 'markup.changed',
        },
        {
            foreground: 'bd93f9',
            token: 'constant.numeric.line-number.find-in-files - match',
        },
        {
            foreground: 'e6db74',
            token: 'entity.name.filename',
        },
        {
            foreground: 'f83333',
            token: 'message.error',
        },
        {
            foreground: 'eeeeee',
            token: 'punctuation.definition.string.begin.json - meta.structure.dictionary.value.json',
        },
        {
            foreground: 'eeeeee',
            token: 'punctuation.definition.string.end.json - meta.structure.dictionary.value.json',
        },
        {
            foreground: '8be9fd',
            token: 'meta.structure.dictionary.json string.quoted.double.json',
        },
        {
            foreground: 'feeca0',
            token: 'meta.structure.dictionary.value.json string.quoted.double.json',
        },
        {
            foreground: '50fa7b',
            token: 'meta meta meta meta meta meta meta.structure.dictionary.value string',
        },
        {
            foreground: 'ffb86c',
            token: 'meta meta meta meta meta meta.structure.dictionary.value string',
        },
        {
            foreground: 'be74fd',
            token: 'meta meta meta meta meta.structure.dictionary.value string',
        },
        {
            foreground: 'bd93f9',
            token: 'meta meta meta meta.structure.dictionary.value string',
        },
        {
            foreground: '50fa7b',
            token: 'meta meta meta.structure.dictionary.value string',
        },
        {
            foreground: 'ffb86c',
            token: 'meta meta.structure.dictionary.value string',
        },
    ],
    colors: {
        'editor.foreground': '#fafafa',
        'editor.background': '#2c291c',
        'editor.selectionBackground': '#1e1b0d',
        'editor.lineHighlightBackground': '#1e1b0d',
        'editorCursor.foreground': '#fafafa',
        'editorWhitespace.foreground': '#7f7d75',
        'editorIndentGuide.activeBackground': '#c4c3bf',
        'editor.selectionHighlightBorder': '#7f7d75',

        'scrollbarSlider.background': '#49463b',
        'scrollbarSlider.activeBackground': '#49463b',
        'scrollbarSlider.hoverBackground': '#49463b',
    },
})