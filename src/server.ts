import { env } from "../database/env";
import { app } from "./app";

const PORT = env.PORT;

app.listen({
    port: PORT,
}).then(() => {
    console.log(`HTTP server running on PORT ${PORT}`)
});