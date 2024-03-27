// LineProcessor.ts
import { BaseProcessor } from '@language-kit/core'
import HNode from '../base/HNode'
import HVariable from '../nodes/HVariable'
import HUnknown from '../nodes/HUnknown'

export default class HUnknownProcessor extends BaseProcessor<HNode> {

    public order = 99

    public process() {
        const current = this.tokens[0]

        const node = new HUnknown()

        node.tokens.push(current)

        this.tokens.splice(0, 1)
        
        this.nodes.push(node)

        return true
    }
}

