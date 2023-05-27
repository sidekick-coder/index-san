import { describe, it, expect } from 'vitest'

import { createParser } from './parser'
import { NodeType } from '../types/node'

describe('Parser', () => {
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

        expect(result.length).toBe(1)
        expect(result[0].start).toEqual(0)
        expect(result[0].end).toEqual(code.length)
        expect(result[0].type).toEqual(NodeType.Variable)
        expect(result[0].tokens).toEqual(parser.toTokens(code))
    })

    it.each([
        'function hello(){}',
        'function hello(arg1,agr2) { }',
        'function hello(arg1,agr2) { console.log(arg1,agr2) }',
    ])('should convert %o to function node', (code) => {
        const result = parser.toNodes(code)

        expect(result.length).toBe(1)
        expect(result[0].start).toEqual(0)
        expect(result[0].end).toEqual(code.length)
        expect(result[0].type).toEqual(NodeType.Function)
        expect(result[0].tokens).toEqual(parser.toTokens(code))
    })
})
