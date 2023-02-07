import Connection from '../entities/connection'

export default class ConnectionRepository {
    public readonly connections: Connection[] = []

    public async show(id: string) {
        const connection = this.connections.find((connection) => connection.id === id)

        if (!connection) {
            throw new Error('Connection not found')
        }

        return connection
    }

    public async create() {
        const connection = new Connection()

        this.connections.push(connection)

        return connection
    }

    public async update(data: Connection) {
        const index = this.connections.findIndex((connection) => connection.id === data.id)

        if (index === -1) {
            throw new Error('Connection not found')
        }

        this.connections[index] = data

        return data
    }

    public async delete(id: string) {
        const index = this.connections.findIndex((connection) => connection.id === id)

        if (index === -1) return

        this.connections.splice(index, 1)
    }
}
