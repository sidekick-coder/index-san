import { BaseProcessor } from '@language-kit/core'
import HNode from '../base/HNode'
import HImport from '../nodes/HImport'

export default class HImportProcessor extends BaseProcessor<HNode> {

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

    public findProperties(){
        const start = this.tokens.findIndex((t) => t.value === '{')
        const end = this.tokens.findIndex((t) => t.value === '}')

        const properties = [] as HImport['properties']

        const items = [] as  HImport['tokens'][]
        let current = [] as any 

        this.tokens.slice(start + 1, end + 1)
            .filter(t => t.type !== 'WhiteSpace' && t.type !== 'BreakLine')
            .forEach((t, i, array) => {

                if (t.value === ',' || i === array.length - 1) { 
                    items.push(current)
                    current = []
                    return
                }

                current.push(t)
            })

            items.forEach((item) => {
                const [name, _as, ...alias] = item

                if (!name) return

                properties.push({
                    name: name.value,
                    alias: alias?.map(t => t.value).join('') 
                })


            })

        return properties
    }

    public isImport(){
        const [current, _space, next] = this.tokens

        if (current.value !== 'import') return false

        return current.value === 'import' && next.value === '{'
    }

    public process() {
        if (!this.isImport()) return false

        
        const endIndex = this.findEnd()

        if (endIndex === -1) return false

        const tokens = this.tokens.slice(0, endIndex + 1)

        const node = new HImport()

        node.tokens = tokens
        node.from = this.findFrom()
        node.properties = this.findProperties()

        this.nodes.push(node)

        this.tokens.splice(0, endIndex + 1)

        return true
    }
}

