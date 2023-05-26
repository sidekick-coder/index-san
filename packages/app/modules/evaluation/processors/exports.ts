import { defineVariableProcessor, findVariables } from './variables'

interface Callback {
    (key: string, statements: string): string
}

function replaceFunctions(code: string, cb: Callback) {
    const regex = /export\s+function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*\{([\s\S]*?)\}/g

    const matched = code.matchAll(regex)

    if (!matched) return code

    return Array.from(matched).reduce((result, match) => {
        const [fullMatch, name, params, body] = match

        return result.replace(fullMatch, cb(name, `function (${params}) {${body}}`))
    }, code)
}

function replaceVariables(code: string, cb: Callback) {
    const variables = findVariables(code, [`const`])

    return variables.reduce((result, variable) => {
        const name = variable.tokens[2].value

        const isExport = code.slice(variable.start - 7, variable.start) === `export `

        if (!isExport) return result

        const value = variable.tokens
            .slice(6, variable.tokens.length - 1)
            .map((t) => t.value)
            .join(``)

        return result.replace(code.slice(variable.start - 7, variable.end), cb(name, value))
    }, code)
}

export function defineExportProcessor(cb: Callback) {
    return (code: string) => {
        let result = code

        result = result.replace(/export\s+default\s+({[\s\S]*})/g, (_, statements) => {
            return cb('default', statements)
        })

        // replace export default function (){ $statements } > cb('default', `function (){ $statements }`)
        result = result.replace(
            /export\s+default\s+function\s*\(\)\s*{([\s\S]*)}/g,
            (_, statements) => {
                return cb('default', `function (){${statements}}`)
            }
        )

        // replace export const $varname = $value\n > cb($varname, $value) ignore string whitespace
        result = replaceVariables(result, cb)

        // replace export function $name ($args){ $statements } > cb($name, `function (){ $statements }`)
        result = replaceFunctions(result, cb)

        return result
    }
}
