import { BaseProcessor } from '@language-kit/core'
import HNode from '../base/HNode'
import HFunction from '../nodes/HFunction'
import HExportDefaultObject from '../nodes/HExplortDefaultObject'

export default class extends BaseProcessor<HNode> {

    public order = 1

    public findEnd() {
        const start = this.tokens.findIndex((t) => t.value === '{')
        let open = 0

        const index =  this.tokens.findIndex((t, i) => {
            if (i <= start) return false

            if (t.value === '{') {
                open++
                return
            }

            if (open > 0 && t.value === '}') {
                open--
                return
            }

            if (open === 0 && t.value === '}') {
                return true
            }

            return false
        })

        return index
    }

    public findValue() {
        const start = this.tokens.findIndex((t) => t.value === '{')
        const end = this.findEnd()

        return this.tokens.slice(start , end + 1).toText()
    }



    public process() {

		const isExportDefaultObject = this.tokens.slice(0, 5).toText() === 'export default {'



		if (!isExportDefaultObject) {
            return false
        }

        const endIndex = this.findEnd()

        if (endIndex === -1) {
            console.error('[hecate] invalid export default object')
            return false
        } 

        const tokens = this.tokens.slice(0, endIndex + 1)

		const node = new HExportDefaultObject()

        node.tokens = tokens
		node.value = this.findValue()
       
        this.nodes.push(node)

        this.tokens.splice(0, endIndex + 1)

		return true 

    }
}

