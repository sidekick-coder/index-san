import { MarkdownNode } from '@language-kit/markdown'
import uniqueId from 'lodash/uniqueId'

export class NodeWithId extends MarkdownNode {
    public id: string

    constructor(payload: Pick<MarkdownNode, 'tokens' | 'type'>, id?: string) {
        super()

        Object.assign(this, payload)

        this.id = id ?? uniqueId('node:')
    }
}
