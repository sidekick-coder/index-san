import uuid from 'uuid-random'

interface Column {
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
    public columns = [] as Column[]

    constructor(
        props: Omit<Collection, 'id'>,
        id?: string
    ){

        Object.assign(this, props)

        this.id = id ?? uuid()

    }
}