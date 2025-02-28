import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
    app.get('/', { preHandler: [checkSessionIdExists] }, async (request: FastifyRequest, response: FastifyReply) => {
        const { sessionId } = request.cookies;
        const transactions = await knex('transactions')
            .where('session_id', sessionId)
            .select();

        response.status(200).send({ transactions });
    });

    app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request: FastifyRequest, response: FastifyReply) => {
        const getTransactionParamsSchema = z.object({
            id: z.string().uuid(),
        });

        const { id } = getTransactionParamsSchema.parse(request.params);
        const { sessionId } = request.cookies;

        const transaction = await knex('transactions')
            .where({
                session_id: sessionId,
                id,
            })
            .first();

        response.status(200).send({ transaction });
    });

    app.post('/', async (request: FastifyRequest, response: FastifyReply) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),
        });

        const { title, amount, type } = createTransactionBodySchema.parse(request.body);

        let { sessionId } = request.cookies;
        if (!sessionId) {
            sessionId = randomUUID();

            response.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            });
        };

        await knex('transactions').insert({
            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
            session_id: sessionId,
        });

        response.status(201).send();
    });

    app.get('/summary', { preHandler: [checkSessionIdExists] }, async (request, response) => {
        try {
            const { sessionId } = request.cookies;

            if (!sessionId) {
                throw new Error('Session ID is missing');
            };

            const summary = await knex('transactions')
                .where('session_id', sessionId)
                .sum('amount', { as: 'amount' })
                .first();

            response.status(200).send({ summary });
        } catch (error) {
            console.error('Error fetching summary:', error);
            response.status(500).send({ error: 'Internal Server Error' });
        };
    });
}
