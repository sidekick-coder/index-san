import { TokenType } from '@language-kit/lexer'
import { defineProcessor } from '../helpers/define-processor'
import { Node, NodeType, NodeVariable } from '../types/node'
import { ParserToken } from '../types/token'
import { useTokenHelper } from '../helpers/token-helper'

const helper = useTokenHelper()

const declarationTypes = ['const', 'let', 'var']

export function findVariableNameTokens(tokens: ParserToken[]) {
    const declarationIndex = tokens.findIndex((t) => declarationTypes.includes(t.value))
    const separatorIndex = tokens.findIndex((t) => t.value === '=')

    if ([declarationIndex, separatorIndex].includes(-1)) return []

    const start = declarationIndex + 1
    const end = separatorIndex

    return tokens.slice(start, end)
}

export function findVariableName(tokens: ParserToken[]) {
    const nameTokens = findVariableNameTokens(tokens)

    if (!nameTokens.length) return ''

    const nameWithoutWhiteSpace = helper.withoutWhiteSpace(nameTokens)

    return helper.toString(nameWithoutWhiteSpace)
}

export function findVariableEndIndex(tokens: ParserToken[]) {
    const startIndex = tokens.findIndex((t) => t.value === '=')

    const startStatement = tokens[startIndex + 2]

    if (!startStatement || startIndex === -1) return -1

    const startStatementIndex = tokens.findIndex((t) => t === startStatement)

    const cases = [
        { start: `"`, end: `"` },
        { start: `'`, end: `'` },
        { start: '`', end: '`' },
        { start: '{', end: '}' },
        { start: '[', end: ']' },
    ]

    const currentCase = cases.find((c) => c.start === startStatement.value)
    const isFunction = startStatement.value === 'function'
    const isArrowFunction = helper.toString(tokens.slice(startStatementIndex)).includes('() => {')
    const isFunctionCall = helper.isCall(tokens.slice(startStatementIndex))

    const endMustBeBreakLine = !currentCase && !isFunction

    return tokens.findIndex((t, i) => {
        if (i <= startStatementIndex) return false

        // const test = "123"
        // const test = '123'
        // const test = `123`
        // const test = { a: 1 }

        if (currentCase) {
            return t.value === currentCase.end
        }

        // const test = function() {}
        if (isFunction) {
            return t.value === '}'
        }

        // const test = () => {}
        if (isArrowFunction) {
            return t.value === '}'
        }

        // const test = ref(1)
        // const test = ref({ a: 1 })
        if (isFunctionCall) {
            return t.value === ')'
        }

        // const test = 123
        // const test = 1 + 2
        // const test = anotherVariable
        if (endMustBeBreakLine && t.type === TokenType.BreakLine) return true

        if (t.type === TokenType.EndOfFile) return true

        return false
    })
}

export function findVariableValue(tokens: ParserToken[]) {
    const start = tokens.findIndex((t) => t.value === '=')
    const end = findVariableEndIndex(tokens)

    if (start === -1 || end === -1) return ''

    const valueTokens = tokens.slice(start + 2, end + 1)

    return helper.toString(valueTokens)
}

export default defineProcessor({
    process(options) {
        const { tokens, nodes } = options

        const result = {
            processed: false,
            tokens,
            nodes,
        }

        if (!['const', 'let', 'var'].includes(tokens[0].value)) {
            return result
        }

        const endIndex = findVariableEndIndex(tokens)

        if (endIndex === -1) return result

        const current = tokens[0]
        const name = findVariableName(tokens)
        const nodeTokens = tokens.slice(0, endIndex + 1)
        const value = findVariableValue(tokens)

        const node: NodeVariable = {
            type: NodeType.Variable,
            start: current.start,
            end: tokens[endIndex].end,
            name: name,
            value: value,
            tokens: nodeTokens,
        }

        result.processed = true
        result.tokens = tokens.slice(endIndex + 1)
        result.nodes = [...nodes, node]

        return result
    },
})
