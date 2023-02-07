import type { FastifyInstance } from 'fastify'
import GoogleConfig from '../config/google'
import ConnectionRepository from '../repositories/connection-repository'

import StartGoogleConnection from '../user-cases/start-google-connection'
import HandleGoogleCallback from '../user-cases/handle-google-callback'
import ShowConnection from '../user-cases/show-connection'

export default async (app: FastifyInstance) => {
    // google oauth

    const connectionRepository = new ConnectionRepository()

    app.get('/auth/google/start', async () => {
        const googleConfig = new GoogleConfig({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            redirectUri: process.env.GOOGLE_REDIRECT_URI!,
        })

        const useCase = new StartGoogleConnection(googleConfig, connectionRepository)

        return await useCase.execute()
    })

    app.get('/auth/google/callback', async (request) => {
        const query = request.query as Record<string, string>

        const connectionId = query.state.split('=')[1]

        const useCase = new HandleGoogleCallback(connectionRepository)

        await useCase.execute({
            code: query.code,
            scope: query.scope,
            connectionId,
        })

        return {
            message: 'Authorized, You can return to the app',
        }
    })

    app.get('/auth/google/connections/:id', async (request) => {
        const connectionId = (request.params as any).id

        const showConnection = new ShowConnection(connectionRepository)

        return await showConnection.execute({ connectionId })
    })
}
