import {databaseClient} from "$lib/database-client.js";

export async function createDocument(props) {
    const id = crypto.randomUUID();

    await databaseClient.execute({
        sql: 'INSERT INTO documents(id, name, key) VALUES(?,?,?)',
        args: [id, props.name, props.key]
    })

    return id
}

export async function listDocuments() {
    const response = await databaseClient.execute('SELECT * FROM documents');

    return response.rows
}

export async function getDocument(id) {
    const response = await databaseClient.execute({
        sql: 'SELECT * FROM documents WHERE id = ?;',
        args: [id]
    })
    const [document] = response.rows

    return document ?? null
}