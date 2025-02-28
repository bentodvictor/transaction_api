import { Knex, knex as setupKnex } from "knex";
import { env } from "../database/env";

const databaseUrl = env.DATABASE_URL;

if (!databaseUrl) {
    const errorMsg = 'Database env not found!';
    console.error(errorMsg);
    throw new Error(errorMsg);
}

export const config: Knex.Config = {
    client: env.DATABASE_CLIENT,
    connection: env.DATABASE_CLIENT === 'sqlite'
        ? { filename: databaseUrl }
        : env.DATABASE_URL,
    migrations: {
        extension: 'ts',
        directory: './database/migrations'
    },
    useNullAsDefault: true
}

export const knex = setupKnex(config);