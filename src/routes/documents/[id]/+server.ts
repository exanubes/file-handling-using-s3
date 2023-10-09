import { json } from '@sveltejs/kit';
import {
	getDocument,
	getRestoredDocuments,
	removeDocument,
	updateDocument
} from '$lib/documents.js';
import { getVersionsList, removeObject } from '$lib/s3.js';
import { Bucket } from 'sst/node/bucket';
import type { RequestHandler } from './$types';

export const POST = async function POST({ request, params }) {
	const { name } = await request.json();
	const { id } = params;

	const response = await updateDocument({ id, name });

	return json(
		{
			message: 'updated',
			data: response
		},
		{ status: 200 }
	);
} satisfies RequestHandler;

export const GET = async function GET({ params }) {
	const { id } = params;

	const document = await getDocument(id);

	if (document) {
		const response = await getVersionsList({
			key: document.key,
			bucket: Bucket.uploads.bucketName
		});

		const restoredDocuments = await getRestoredDocuments(document.key);

		const data = response.map((version) => {
			const restoredData = restoredDocuments.find(
				(restoredDocument) => restoredDocument.version === version.versionId
			);

			return {
				...version,
				restoredUntil: restoredData?.validUntil ?? null,
				restoredStatus: restoredData?.status ?? null
			};
		});

		return json({ versions: data }, { status: 200 });
	}

	return json(
		{
			message: 'Not Found.',
			versions: []
		},
		{ status: 404 }
	);
} satisfies RequestHandler;

export const DELETE = async function DELETE({ params }) {
	const { id } = params;

	const document = await getDocument(id);

	if (document) {
		const response = await removeObject({
			bucket: Bucket.uploads.bucketName,
			key: document.key
		});
		await removeDocument(document.id);
		return json({ response }, { status: 200 });
	}

	return json({ message: 'Not Found.', response: null }, { status: 404 });
} satisfies RequestHandler;
