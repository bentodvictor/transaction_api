import { config } from "dotenv";
import { z } from "zod";

process.env.NODE_ENV === 'test'
    ? config({ path: '.env.test' })
    : config();

const envSchema = z.object({
    DATABASE_URL: z.string(),
    DATABASE_CLIENT: z.enum(['pg', 'sqlite']),
    PORT: z.coerce.number(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production')
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
    const errorMsg = 'Invalid environment variables.';
    console.error(errorMsg, _env.error.format());
    throw new Error(errorMsg);
};

export const env = _env.data;