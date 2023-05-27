import { describe, it, expect } from 'vitest'

import { createParser } from './parser'
import { NodeType, NodeVariable } from '../types/node'

describe('Processor Variable', () => {
    const parser = createParser()

    it.each([
        "const code = 'hello ;\n world';",
        'const code = "hello ;\n world";',
        'const code = "hello ;\n world"',
        'const code = `hello ;\n world`',
        'const code = {\n    hello: "world"\n}',
        'const code = [\n    "hello",\n    "world"\n]\n',
        'const code = ref("hello")',
        'const code = ref({\n    hello: "world"\n})',
    ])('should convert %o to variable node', (code) => {
        const result = parser.toNodes(code)

        const node = result[0] as NodeVariable

        expect(result.length).toBe(1)

        expect(node.name).toEqual('code')
        expect(node.value).toBe(code.slice(13))
        expect(node.start).toEqual(0)
        expect(node.end).toEqual(code.length)
        expect(node.type).toEqual(NodeType.Variable)
        expect(node.tokens).toEqual(parser.toTokens(code))
    })
})
