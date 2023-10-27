import {createClient} from "@libsql/client";
import {Config} from "sst/node/config";

const databaseClient = createClient({
    url: Config.DB_URL,
    authToken:
        Config.DB_AUTH_TOKEN
});

export async function handler() {
    await databaseClient.execute({
        sql: 'DELETE FROM restores WHERE validUntil < ?',
        args: [new Date().toISOString()]
    })
}
