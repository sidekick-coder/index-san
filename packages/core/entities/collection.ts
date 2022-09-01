import { v4 as uuid } from 'uuid';

export default class Collection {
    public id: string
    public name: string
    public path: string
    
    public crudName: string

    constructor(
        props: Omit<Collection, 'id'>,
        id?: string
    ){

        Object.assign(this, props)

        this.id = id ?? uuid()

    }
}