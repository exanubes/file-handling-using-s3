import {createClient} from "@libsql/client";
import { Config } from 'sst/node/config'
export const databaseClient = createClient({
    url: Config.DB_URL,
    authToken: Config.DB_AUTH_TOKEN
})