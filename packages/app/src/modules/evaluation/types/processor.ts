import { Node } from '../types/node'
import { ParserToken } from './token'

interface Input {
    tokens: ParserToken[]
    nodes: Node[]
}

interface Output {
    processed: boolean
    tokens: ParserToken[]
    nodes: Node[]
}

export interface Processor {
    order?: number
    process: (options: Input) => Output
}
