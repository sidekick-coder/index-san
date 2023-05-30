import { Node } from '@language-kit/markdown'
import uniqueId from 'lodash/uniqueId'

export class NodeWithId extends Node {
    public id: string

    constructor(node: Pick<Node, 'tokens' | 'type'>, id?: string) {
        super(node)

        this.id = id ?? uniqueId('node:')
    }
}
