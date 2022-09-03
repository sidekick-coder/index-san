import { v4 as uuid } from 'uuid'

export default class Item {
    public id: string

    [key: string]: any

    constructor(props: any, id?: string) {
        Object.assign(this, props)

        this.id = id ?? uuid()
    }
}