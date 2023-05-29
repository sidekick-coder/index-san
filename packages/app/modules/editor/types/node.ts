import { Node } from '@language-kit/markdown'

export class NodeWithId extends Node {
    public id: string

    constructor(id: string, node: Pick<Node, 'tokens' | 'type'>) {
        super(node)

        this.id = id
    }
}
