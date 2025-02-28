import { test, beforeAll, afterAll, it, expect, beforeEach } from 'vitest';
import { app } from '../src/app';
import request from 'supertest';
import { describe } from 'node:test';
import { execSync } from 'node:child_process';

describe('Transacations routes', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        execSync('npx knex migrate:rollback --all');
        execSync('npx knex migrate:latest');
    });

    it('should user be able to create a new transaction', async () => {
        await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit',
            })
            .expect(201);
    });

    it('should be able to list all transactions', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit',
            })
            .expect(201);

        const cookies = createTransactionResponse.get('Set-Cookie');

        if (!cookies) throw new Error('Cookies are required for this test.');

        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200);

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            }),
        ]);
    });

    it('should be able to get a specific transaction', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit',
            })
            .expect(201);

        const cookies = createTransactionResponse.get('Set-Cookie');

        if (!cookies) throw new Error('Cookies are required for this test.');

        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200);

        const transactionId = listTransactionsResponse.body?.transactions[0]?.id;

        const getTransactionResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies)
            .expect(200);

        expect(getTransactionResponse.body.transaction).toEqual(
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            })
        );
    });

    it('should be able to get the summary', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit',
            })
            .expect(201);

        const cookies = createTransactionResponse.get('Set-Cookie');

        if (!cookies) throw new Error('Cookies are required for this test.');

        await request(app.server)
            .post('/transactions')
            .set('Cookie', cookies)
            .send({
                title: 'New transaction',
                amount: 2000,
                type: 'debit',
            })
            .expect(201);

        const summaryResp = await request(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies)
            .expect(200);

        expect(summaryResp.body.summary).toEqual({ amount: 3000 });
    });
});