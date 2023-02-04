import ConnectionRepository from '../repository/connection-repository'

export interface ShowConnectionDTO {
    connectionId: string
}

export default class ShowConnection {
    constructor(public readonly connectionRepository: ConnectionRepository) {}

    public async execute(data: ShowConnectionDTO) {
        const connection = await this.connectionRepository.show(data.connectionId)

        if (connection.token) {
            await this.connectionRepository.delete(connection.id)
        }

        return {
            data: connection,
        }
    }
}
