import uuid from 'uuid-random'

export default class Connection {
    public id: string
    public token?: string
    public scope?: string

    constructor(data?: Omit<Connection, 'id'>, id?: string) {
        this.id = id || uuid()
        this.token = data?.token
        this.scope = data?.scope
    }
}
