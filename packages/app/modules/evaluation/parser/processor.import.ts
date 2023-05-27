import { TokenType } from '@language-kit/lexer'
import { defineProcessor } from '../helpers/define-processor'
import { NodeImport, NodeType, NodeVariable } from '../types/node'
import { ParserToken } from '../types/token'

const quotes = [`'`, `"`, '`']

function findStatements(tokens: ParserToken[]) {
    const start = tokens[2]

    if (!start) {
        return []
    }

    if (start.type == TokenType.Word) {
        return [start]
    }

    if (start.value === '{') {
        const end = tokens.findIndex((t) => t.value === '}')

        return tokens.slice(2, end + 1)
    }

    return []
}

function findModuleId(tokens: ParserToken[]) {
    const start = tokens.findIndex((t) => quotes.includes(t.value))
    const end = tokens.findIndex((t, i) => {
        if (i <= start) return false

        return quotes.includes(t.value)
    })

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
        const moduleId = findModuleId(tokens)

        if (current.value !== 'import') {
            return result
        }

        const endIndex = tokens.findIndex((t, i) => {
            const prev = tokens[i - 1]

            if (!prev) return false

            if (prev.type !== TokenType.Word) return false

            if (prev.value !== moduleId) return false

            return quotes.includes(t.value)
        })

        if (endIndex === -1) {
            return result
        }

        const nodeTokens = tokens.slice(0, endIndex + 1)
        const statementsTokens = findStatements(tokens)
        const statements = statementsTokens.map((t) => t.value).join('')

        if (!nodeTokens.length) {
            return result
        }

        const node: NodeImport = {
            type: NodeType.Import,
            start: nodeTokens[0].start,
            end: nodeTokens[nodeTokens.length - 1].end,
            moduleId,
            statements,
            tokens: nodeTokens,
        }

        result.processed = true
        result.nodes = [...nodes, node]
        result.tokens = tokens.slice(endIndex + 1)

        return result
    },
})
