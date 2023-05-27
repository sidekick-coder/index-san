import { TokenType } from '@language-kit/lexer'
import { defineProcessor } from '../helpers/define-processor'
import { NodeExport, NodeImport, NodeType, NodeVariable } from '../types/node'
import { ParserToken } from '../types/token'
import { useTokenHelper } from '../helpers/token-helper'
import { findVariableEndIndex, findVariableName, findVariableValue } from './processor.variable'

const helper = useTokenHelper()

function findExportEndIndex(tokens: ParserToken[]) {
    const [declaration] = helper.withoutWhiteSpace(tokens.slice(1))

    const endWithBraces = ['default', 'function'].includes(declaration.value)

    if (endWithBraces) {
        return tokens.findIndex((t) => t.value === '}')
    }

    if (declaration.value === 'const') {
        return findVariableEndIndex(tokens)
    }

    return -1
}

function findExportKey(tokens: ParserToken[]) {
    const [declaration, identifier] = helper.withoutWhiteSpace(tokens.slice(1))

    if (!declaration) return ''

    // export default function() {}
    // export default {}
    if (declaration.value === 'default') {
        return 'default'
    }

    // export function name() {}
    if (declaration.value === 'function') {
        return identifier?.value
    }

    // export const name = 123
    // export let name = 123
    // export var name = 123
    if (['const', 'let', 'var'].includes(declaration.value)) {
        return findVariableName(tokens.slice(1))
    }

    return ''
}

function findExportStatements(tokens: ParserToken[]) {
    const end = findExportEndIndex(tokens)

    const [declaration, identifier] = helper.withoutWhiteSpace(tokens.slice(1))

    if (!declaration || !identifier || end === -1) return ''

    // export default {}
    if (declaration.value === 'default') {
        const start = tokens.findIndex((t) => t.value === '{')

        if (start === -1) return ''

        return helper.toString(tokens.slice(start, end + 1))
    }

    // export function name() {}
    if (declaration.value === 'function') {
        const start = tokens.findIndex((t) => t === declaration)

        if (start === -1) return ''

        return helper.toString(tokens.slice(start, end + 1))
    }

    // export const name = 123
    // export let name = 123
    // export var name = 123
    if (['const', 'let', 'var'].includes(declaration.value)) {
        return findVariableValue(tokens)
    }

    return ''
}

export default defineProcessor({
    process(options) {
        const { tokens, nodes } = options

        const result = {
            processed: false,
            tokens,
            nodes,
        }

        if (tokens[0].value !== 'export') {
            return result
        }

        const endIndex = findExportEndIndex(tokens)

        if (endIndex === -1) return result

        const nodeTokens = tokens.slice(0, endIndex + 1)
        const key = findExportKey(tokens)
        const statements = findExportStatements(nodeTokens)

        if (!nodeTokens.length) return result

        const node: NodeExport = {
            type: NodeType.Export,
            key,
            statements: statements,
            tokens: nodeTokens,
            end: nodeTokens[nodeTokens.length - 1].end,
            start: nodeTokens[0].start,
        }

        result.processed = true
        result.nodes.push(node)
        result.tokens = tokens.slice(endIndex + 1)

        return result
    },
})
