import { TokenType } from '@language-kit/lexer'
import { defineProcessor } from '../helpers/define-processor'
import { Node, NodeType } from '../types/node'

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

        const node: Node = {
            start: current.start,
            end: tokens[endIndex].end,
            type: NodeType.Function,
            tokens: tokens.slice(0, endIndex + 1),
        }

        result.processed = true
        result.tokens = tokens.slice(endIndex + 1)
        result.nodes = [...nodes, node]

        return result
    },
})
