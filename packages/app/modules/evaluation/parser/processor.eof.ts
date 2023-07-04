import { TokenType } from '@language-kit/lexer'
import { defineProcessor } from '../helpers/define-processor'
import { Node, NodeType } from '../types/node'

export default defineProcessor({
    order: 98,
    process(options) {
        const { tokens, nodes } = options

        const result = {
            processed: false,
            tokens,
            nodes,
        }

        const current = tokens[0]

        const isEof = current.type === TokenType.EndOfFile

        if (!isEof) return result

        const lastNode = result.nodes[nodes.length - 1]

        if (!lastNode) return result

        lastNode.tokens.push(current)

        result.processed = true
        result.tokens = tokens.slice(1)

        return result
    },
})
