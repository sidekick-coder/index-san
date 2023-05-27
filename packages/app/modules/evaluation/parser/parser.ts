import { Lexer, TokenType } from '@language-kit/lexer'
import { Node } from '../types/node'
import { Processor } from '../types/processor'
import { ParserToken } from '../types/token'

import importProcessor from './processor.import'
import exportProcessor from './processor.export'
import variableProcessor from './processor.variable'
import functionProcessor from './processor.function'
import eofProcessor from './processor.eof'
import unknownProcessor from './processor.unknown'

export function createParser() {
    const lexer = new Lexer()
    const processors: Processor[] = [
        importProcessor,
        exportProcessor,
        variableProcessor,
        functionProcessor,
        eofProcessor,
        unknownProcessor,
    ]

    function toTokens(value: string) {
        const tokens = lexer.tokenize(value)

        let start = 0
        let end = 0

        return tokens.map((t) => {
            end += t.value.length

            const token = {
                ...t,
                start,
                end,
            }

            start = end

            return token
        })
    }

    function toNodes(value: string) {
        let tokens: ParserToken[] = toTokens(value)
        let nodes: Node[] = []

        while (tokens.length) {
            const result = processors.find((p) => {
                const test = p.process({ tokens, nodes })

                tokens = test.tokens
                nodes = test.nodes

                return test.processed
            })

            if (result) continue

            console.debug('[parser] unhandled token', tokens[0])

            tokens.shift()
        }

        return nodes
    }

    return {
        toTokens,
        toNodes,
    }
}
