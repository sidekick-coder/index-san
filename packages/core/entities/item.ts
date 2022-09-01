import { v4 as uuid } from 'uuid';

export default class Item {
    public id: string

    constructor(props: Omit<Item, 'id'>, id?: string) {
        Object.assign(this, props)

        this.id = id ?? uuid()
    }
}