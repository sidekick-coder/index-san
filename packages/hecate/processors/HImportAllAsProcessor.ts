import { BaseProcessor } from '@language-kit/core'
import HNode from '../base/HNode'
import HImport from '../nodes/HImport'
import HImportDefault from '../nodes/HImportDefault'
import HImportAllAs from '../nodes/HImportAllAs'

export default class HImportAllAsProcessor extends BaseProcessor<HNode> {

    public order = 1

    public findEnd() {
        const start = this.tokens.findIndex((t) => t.value === '"' || t.value === "'")

        const end = this.tokens.findIndex((t, i) => {
            if (i <= start) return false

            return t.value === '"' || t.value === "'";
        })

        return end
    }

    public findFrom() {
        const start = this.tokens.findIndex((t) => t.value === '"' || t.value === "'")
        const end = this.tokens.findIndex((t, i) => {
            if (i <= start) return false

            return t.value === '"' || t.value === "'";
        })

        return this.tokens.slice(start + 1, end).map((t) => t.value).join('')
    }

    public findName(){
        const start = this.tokens.findIndex((t) => t.value === 'as') + 1
        const end = this.tokens.findIndex((t) => t.value === 'from')

        return this.tokens.slice(start + 1, end)
            .filter(t => t.type !== 'WhiteSpace')
			.toText()
    }

    public isImport(){
        return this.tokens.slice(0, 5).toText() === 'import * as'
    }

    public process() {
        if (!this.isImport()) return false
        
        const endIndex = this.findEnd()

        if (endIndex === -1) return false

        const tokens = this.tokens.slice(0, endIndex + 1)

        const node = new HImportAllAs()

        node.tokens = tokens
        node.from = this.findFrom()
        node.name = this.findName()

        this.nodes.push(node)

        this.tokens.splice(0, endIndex + 1)

        return true
    }
}

