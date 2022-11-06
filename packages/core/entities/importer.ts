import uuid from 'uuid-random'

export default class Importer {
    public id: string
    public content: string

    constructor(props: Omit<Importer, 'id'>, id?: string) {
        Object.assign(this, props)

        this.id = id ?? uuid()

    }
}