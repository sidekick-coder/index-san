import uuid from 'uuid-random'

export interface CollectionColumn {
    id: string,
    field: string
    label: string
    readonly?: boolean
}

export default class Collection {
    public id: string
    public name: string
    public path: string
    
    public crudName: string
    public columns = [] as CollectionColumn[]

    constructor(
        props: Omit<Collection, 'id'>,
        id?: string
    ){

        Object.assign(this, props)

        this.id = id ?? uuid()

    }
}