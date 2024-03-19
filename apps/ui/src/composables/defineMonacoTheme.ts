import * as monaco from 'monaco-editor'
import merge from 'lodash/merge'

export interface MonacoThemeDefinition extends monaco.editor.IStandaloneThemeData {
    name: string
}

export function defineMonacoTheme(value: MonacoThemeDefinition) {    
    return value
}