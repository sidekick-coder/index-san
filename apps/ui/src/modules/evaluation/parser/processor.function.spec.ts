import { describe, it, expect } from 'vitest'

import { createParser } from './parser'
import { NodeFunction, NodeType } from '../types/node'

describe('Processor Function', () => {
    const parser = createParser()

    it.each([
        ['function hello(){}', 'hello', '', ''],
        ['function hello(arg1,agr2) { }', 'hello', 'arg1,agr2', ' '],
        [
            'function hello(arg1,agr2) { console.log(arg1,agr2) }',
            'hello',
            'arg1,agr2',
            ' console.log(arg1,agr2) ',
        ],
    ])('should convert %o to function node', (code, name, params, body) => {
        const result = parser.toNodes(code)

        const node = result[0] as NodeFunction

        expect(result.length).toBe(1)

        expect(node.name).toEqual(name)
        expect(node.params).toBe(params)
        expect(node.body).toBe(body)

        expect(node.start).toEqual(0)
        expect(node.end).toEqual(code.length)
        expect(node.type).toEqual(NodeType.Function)
        expect(node.tokens).toEqual(parser.toTokens(code))
    })
})
