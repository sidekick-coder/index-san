import { describe, it, expect } from 'vitest'

import { createParser } from './parser'
import { NodeType, NodeVariable } from '../types/node'

describe('Processor Variable', () => {
    const parser = createParser()

    it.each([
        ['const message = "hello ;\n world"', 'message', '"hello ;\n world"'],
        ['const message = `hello ;\n world`', 'message', '`hello ;\n world`'],
        ['const message_snake_case = `hello ;\n world`', 'message_snake_case', '`hello ;\n world`'],
        [
            'const messageObject = {\n    hello: "world"\n}',
            'messageObject',
            '{\n    hello: "world"\n}',
        ],
        [
            'const messageObject = [\n    "hello",\n    "world"\n]',
            'messageObject',
            '[\n    "hello",\n    "world"\n]',
        ],
        ['const referenceObject = ref("hello")', 'referenceObject', 'ref("hello")'],
        [
            'const referenceObject = ref({\n    hello: "world"\n})',
            'referenceObject',
            'ref({\n    hello: "world"\n})',
        ],
    ])('should convert %o to variable node', (code, name, value) => {
        const result = parser.toNodes(code)

        const node = result[0] as NodeVariable

        expect(result.length).toBe(1)

        expect(node.name).toEqual(name)
        expect(node.value).toBe(value)
        expect(node.start).toEqual(0)
        expect(node.end).toEqual(code.length)
        expect(node.type).toEqual(NodeType.Variable)
        expect(node.tokens).toEqual(parser.toTokens(code))
    })
})
