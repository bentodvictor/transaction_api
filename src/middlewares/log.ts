import { FastifyRequest } from 'fastify'

export async function log(request: FastifyRequest) {
    console.log(`${request.method} ${request.url}`);
}
