import { defineProcessor } from '../helpers/define-processor'
import { Node, NodeType } from '../types/node'

export default defineProcessor({
    order: 99,
    process(options) {
        const { tokens, nodes } = options

        const result = {
            processed: false,
            tokens,
            nodes,
        }

        const current = tokens[0]

        const node: Node = {
            type: NodeType.Unknown,
            tokens: [current],
            start: current.start,
            end: current.end,
        }

        result.processed = true
        result.nodes.push(node)
        result.tokens.shift()

        return result
    },
})
