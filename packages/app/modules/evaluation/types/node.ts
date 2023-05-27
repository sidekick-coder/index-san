import { ParserToken } from './token'

export enum NodeType {
    Unknown = 'Unknown',
    Variable = 'Variable',
    Function = 'Function',
}

export interface Node {
    start: number
    end: number
    type: NodeType
    tokens: ParserToken[]
}

export interface NodeVariable extends Node {
    type: NodeType.Variable
    name: string
    value: string
}
