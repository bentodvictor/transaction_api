import fastify from "fastify";
import cookie from "@fastify/cookie";
import { transactionsRoutes } from "./routes/transactions";
import { log } from "./middlewares/log";

export const app = fastify();

app.register(cookie)
app.addHook('preHandler', log);
app.register(transactionsRoutes, { prefix: '/transactions' });