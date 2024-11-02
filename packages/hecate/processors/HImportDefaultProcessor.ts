import { BaseProcessor } from '@language-kit/core'
import HNode from '../base/HNode'
import HImport from '../nodes/HImport'
import HImportDefault from '../nodes/HImportDefault'

export default class HImportDefaultProcessor extends BaseProcessor<HNode> {

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
        const start = this.tokens.findIndex((t) => t.type === 'WhiteSpace')
        const end = this.tokens.findIndex((t) => t.value === 'from')

        return this.tokens.slice(start + 1, end)
            .filter(t => t.type === 'Word')
			.toText()
    }

    public isImport(){
        const [current, next] = this.tokens

        if (current.value !== 'import') return false

        return next.type === 'WhiteSpace' 
    }

    public process() {
        if (!this.isImport()) return false
        
        const endIndex = this.findEnd()

        if (endIndex === -1) return false

        const tokens = this.tokens.slice(0, endIndex + 1)

        const node = new HImportDefault()

        node.tokens = tokens
        node.from = this.findFrom()
        node.name = this.findName()

        this.nodes.push(node)

        this.tokens.splice(0, endIndex + 1)

        return true
    }
}

