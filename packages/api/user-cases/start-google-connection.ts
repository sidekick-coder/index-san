import GoogleConfig from '../config/google'
import ConnectionRepository from '../repository/connection-repository'

export interface ShowGoogleUrlDTO {
    accessId: string
}

export default class StartGoogleConnection {
    constructor(
        public readonly googleConfig: GoogleConfig,
        public readonly connectionRepository: ConnectionRepository
    ) {}

    public async execute() {
        const connection = await this.connectionRepository.create()

        const params = new URLSearchParams([
            ['client_id', this.googleConfig.clientId],
            ['redirect_uri', `${this.googleConfig.redirectUri}`],
            ['response_type', 'code'],
            ['scope', 'https://www.googleapis.com/auth/userinfo.email'],
            ['state', `connectionId=${connection.id}`],
        ])

        const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

        return {
            data: { url, connectionId: connection.id },
        }
    }
}
