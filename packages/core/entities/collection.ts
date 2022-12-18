import uuid from 'uuid-random'
import Column from './column'
export default class Collection {
    public id: string
    public workspaceId?: string
    public name: string
    public path: string

    public crudName: string
    public columns = [] as Column[]

    constructor(props: Omit<Collection, 'id'>, id?: string) {
        Object.assign(this, props)

        this.id = id ?? uuid()
    }
}
