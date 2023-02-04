import ConnectionRepository from '../repository/connection-repository'

interface ShowGoogleAccessTokenDTO {
    connectionId: string
    code: string
    scope: string
}

export default class ShowGoogleAccessTokenUseCase {
    constructor(public readonly connectionRepository: ConnectionRepository) {}

    public async execute(data: ShowGoogleAccessTokenDTO) {
        const connection = await this.connectionRepository.show(data.connectionId)

        await this.connectionRepository.update({
            ...connection,
            token: data.code,
            scope: data.scope,
        })

        return await this.connectionRepository.show(data.connectionId)
    }
}
