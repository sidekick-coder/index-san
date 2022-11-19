import uuid from 'uuid-random'

export interface CollectionColumn {
    id: string,
    field: string
    type: string
    label: string
    readonly?: boolean
    [key: string]: any
}

export interface CollectionView {
    id: string
    [key: string]: any
}

export default class Collection {
    public id: string
    public workspaceId?: string
    public name: string
    public path: string
    
    public crudName: string
    public columns = [] as CollectionColumn[]
    public views: CollectionView[] = []

    constructor(
        props: Omit<Collection, 'id'>,
        id?: string
    ){

        Object.assign(this, props)

        this.id = id ?? uuid()

    }
}