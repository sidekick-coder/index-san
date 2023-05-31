import * as monaco from 'monaco-editor'
import merge from 'lodash/merge'

export interface RegisterThemeOptions extends monaco.editor.IStandaloneThemeData {
    name: string
}

export function defineTheme(value: RegisterThemeOptions) {
    return value
}

export function mergeTheme(base: RegisterThemeOptions, value: Partial<RegisterThemeOptions>) {
    return merge({}, base, value)
}
