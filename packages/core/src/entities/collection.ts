import uuid from 'uuid-random'
import Column from './column'

export enum RepositoryType {
    Entry = 'entry',
    Script = 'script',
}
export default class Collection {
    public id: string
    public name: string
    public path: string

    public repositoryType: RepositoryType

    public columns = [] as Column[]

    constructor(props: Omit<Collection, 'id'>, id?: string) {
        Object.assign(this, props)

        this.id = id ?? uuid()
    }
}
