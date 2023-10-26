import {createClient} from "@libsql/client";

export const databaseClient = createClient({
    url: 'libsql://moved-huntress-exanubes.turso.io',
    authToken:
        'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTUxMzk3NDgsImlkIjoiYTFhN2FlNGItNTcwNi0xMWVlLTgyN2EtNTI2MmNlY2IzZWJjIn0.XI3RN4mdBDNU0SPqdoEQ3-0Mb_65vcqh6X51Z0C6ZzLG_Zx9YwjghEibqExO1McBKInDM3FCh3dn0ts9Ek5KAQ'
});

export async function handler() {
    await databaseClient.execute({
        sql: 'DELETE FROM restores WHERE validUntil < ?',
        args: [new Date().toISOString()]
    })
}