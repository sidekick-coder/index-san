export default class GoogleConfig {
    public readonly clientId: string
    public readonly clientSecret: string
    public readonly redirectUri: string

    constructor(config: GoogleConfig) {
        this.clientId = config.clientId
        this.clientSecret = config.clientSecret
        this.redirectUri = config.redirectUri
    }
}
