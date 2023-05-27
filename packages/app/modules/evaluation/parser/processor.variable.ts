import { TokenType } from '@language-kit/lexer'
import { defineProcessor } from '../helpers/define-processor'
import { Node, NodeType, NodeVariable } from '../types/node'
import { ParserToken } from '../types/token'

function findName(tokens: ParserToken[]) {
    return tokens.slice(1).find((t) => t.type === TokenType.Word)
}

function findDeclaration(tokens: ParserToken[]) {
    const declarationIndex = tokens.findIndex((t, i) => {
        const prev = tokens[i - 2]

        return prev && prev.value === '='
    })

    return tokens[declarationIndex]
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
        const name = findName(tokens)
        const declaration = findDeclaration(tokens)
        const declarationIndex = tokens.indexOf(declaration)

        if (!current || !declaration || !name) {
            return result
        }

        if (!['const', 'let', 'var'].includes(current.value)) {
            return result
        }

        const openCloseCases = [
            { open: '"', close: '"' },
            { open: "'", close: "'" },
            { open: '`', close: '`' },
            { open: '{', close: '}' },
            { open: '[', close: ']' },
        ]

        const openCase = openCloseCases.find((o) => o.open === declaration.value)

        const isCall =
            declaration.type === TokenType.Word && tokens[declarationIndex + 1].value === '('

        let isOpen = !!openCase

        const endIndex = tokens.findIndex((t, i) => {
            if (i <= declarationIndex) return false

            if (openCase && isOpen) {
                isOpen = t.value !== openCase.close

                return false
            }

            if (isCall) {
                return t.value === ')'
            }

            if (t.type === TokenType.BreakLine) return true

            if (t.type === TokenType.EndOfFile) return true

            if (t.value === ';') return true

            return false
        })

        if (endIndex === -1) return result

        const nodeTokens = tokens.slice(0, endIndex + 1)

        const value = nodeTokens
            .slice(declarationIndex)
            .map((t) => t.value)
            .join('')

        const node: NodeVariable = {
            start: current.start,
            name: name.value,
            value: value,
            end: tokens[endIndex].end,
            type: NodeType.Variable,
            tokens: nodeTokens,
        }

        result.processed = true
        result.tokens = tokens.slice(endIndex + 1)
        result.nodes = [...nodes, node]

        return result
    },
})
