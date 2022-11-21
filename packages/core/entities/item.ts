import uuid from 'uuid-random'

export default class Item {
    public id: string
    public workspaceId?: string
    public collectionId?: string;

    [key: string]: any

    constructor(props: any, id?: string) {
        Object.assign(this, props)

        this.id = id ?? uuid()
    }
}
