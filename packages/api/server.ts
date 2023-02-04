import Fastify, { FastifyInstance } from 'fastify'
import fastifyEnv from '@fastify/env'

import StartGoogleConnection from './user-cases/start-google-connection'
import HandleGoogleCallback from './user-cases/handle-google-callback'

import GoogleConfig from './config/google'
import ConnectionRepository from './repository/connection-repository'

const environment = process.env.NODE_ENV ?? 'development'

const envToLogger: Record<string, any> = {
    development: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
    production: true,
    test: false,
}

const server: FastifyInstance = Fastify({
    logger: envToLogger[environment] ?? true,
})

server.register(fastifyEnv, {
    data: process.env,
    dotenv: true,
    schema: {},
})

// google oauth

const connectionRepository = new ConnectionRepository()

server.get('/auth/google/start', async () => {
    const googleConfig = new GoogleConfig({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectUri: process.env.GOOGLE_REDIRECT_URI!,
    })

    const showGoogleUrlUseCase = new StartGoogleConnection(googleConfig, connectionRepository)

    return await showGoogleUrlUseCase.execute()
})

server.get('/auth/google/callback', async (request) => {
    const query = request.query as Record<string, string>

    const connectionId = query.state.split('=')[1]

    const handleGoogleCallbackUseCase = new HandleGoogleCallback(connectionRepository)

    await handleGoogleCallbackUseCase.execute({
        code: query.code,
        scope: query.scope,
        connectionId,
    })

    return {
        message: 'Authorized, You can return to the app',
    }
})

server.get('/auth/google/connections/:id', async (request) => {
    const connectionId = (request.params as any).id

    const connection = await connectionRepository.show(connectionId)

    return {
        data: connection,
    }
})

// start server

const start = async () => {
    try {
        await server.ready()

        await server.listen({ port: 3000 })
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}
start()
