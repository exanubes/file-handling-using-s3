import { z } from 'zod';
import { databaseClient } from '$lib/database-client.js';
import { documentValidator } from '$lib/validators.js';
/**
 * @description create new document in database
 * @param {{
 *     name: string;
 *     key: string;
 * }} props
 * */
export async function createDocument(props) {
	const id = crypto.randomUUID();

	await databaseClient.execute({
		sql: 'INSERT INTO documents(id, name, key) VALUES(?,?,?)',
		args: [id, props.name, props.key]
	});

	return id;
}

export async function listDocuments() {
	const response = await databaseClient.execute('SELECT * FROM documents');

	return z.array(documentValidator).parse(response.rows);
}

/**
 * @description retrieve existing document from database by id
 * @param {string} id*/
export async function getDocument(id) {
	const response = await databaseClient.execute({
		sql: 'SELECT * FROM documents WHERE id = ?;',
		args: [id]
	});
	const [document] = response.rows;

	return document ? documentValidator.parse(document) : null;
}

export async function updateDocument(props) {
	await databaseClient.execute({
		sql: 'UPDATE documents SET name = ?, deleted = false WHERE id = ?',
		args: [props.name, props.id]
	});
}

export async function removeDocument(id) {
	await databaseClient.execute({
		sql: `UPDATE documents SET deleted = true WHERE id = ?`,
		args: [id]
	});
}

/**
 * @description add a pending restore request to the database
 * @param {{
 *  version: string;
 *  key: string
 * }} props
 */
export async function restoreDocument(props) {
	const id = crypto.randomUUID();

	await databaseClient.execute({
		sql: 'INSERT INTO restores(id, key, version, status) VALUES(?, ?, ?, ?)',
		args: [id, props.key, props.version, 'pending']
	});

	return id;
}

/**
 * @description get a list of restored objects by aws key
 * @param {string} key
 */
export async function getRestoredDocuments(key) {
	const response = await databaseClient.execute({
		sql: 'SELECT * FROM restores WHERE key = ?',
		args: [key]
	});

	return response.rows;
}
