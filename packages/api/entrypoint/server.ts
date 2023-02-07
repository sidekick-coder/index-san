import Fastify, { FastifyInstance } from 'fastify'
import fastifyEnv from '@fastify/env'

import logger from './logger'
import Routes from './routes'

const server: FastifyInstance = Fastify({ logger })

server.register(fastifyEnv, {
    data: process.env,
    dotenv: true,
    schema: {},
})

// routes

server.register(Routes)

// start server

const start = async () => {
    await server.ready()

    await server.listen({ port: 3000 })
}

start().catch((err) => {
    server.log.error(err)

    process.exit(1)
})
