import { TokenType } from '@language-kit/lexer'
import { defineProcessor } from '../helpers/define-processor'
import { Node, NodeFunction, NodeType } from '../types/node'
import { ParserToken } from '../types/token'

function findName(tokens: ParserToken[]) {
    const token = tokens.slice(1).find((t) => t.type === TokenType.Word)

    return token ? token.value : ''
}

function findParams(tokens: ParserToken[]) {
    const start = tokens.findIndex((t) => t.value === '(')
    const end = tokens.findIndex((t) => t.value === ')')

    if (start === -1 || end === -1) {
        return ''
    }

    return tokens
        .slice(start + 1, end)
        .map((t) => t.value)
        .join('')
}

function findBody(tokens: ParserToken[]) {
    const start = tokens.findIndex((t) => t.value === '{')
    const end = tokens.findIndex((t) => t.value === '}')

    if (start === -1 || end === -1) {
        return ''
    }

    return tokens
        .slice(start + 1, end)
        .map((t) => t.value)
        .join('')
}

export default defineProcessor({
    process(options) {
        const { tokens, nodes } = options

        const result = {
            processed: false,
            tokens,
            nodes,
        }

        const current = tokens[0]

        const isFunction = current.value === 'function'

        if (!isFunction) return result

        const endIndex = tokens.findIndex((t) => {
            if (t.value === '}') return true

            if (t.type === TokenType.EndOfFile) return true

            return false
        })

        if (endIndex === -1) return result

        const nodeTokens = tokens.slice(0, endIndex + 1)

        const name = findName(nodeTokens)
        const params = findParams(nodeTokens)
        const body = findBody(nodeTokens)

        const node: NodeFunction = {
            type: NodeType.Function,
            start: current.start,
            end: tokens[endIndex].end,
            name: name,
            params: params,
            body: body,
            tokens: nodeTokens,
        }

        result.processed = true
        result.tokens = tokens.slice(endIndex + 1)
        result.nodes = [...nodes, node]

        return result
    },
})
