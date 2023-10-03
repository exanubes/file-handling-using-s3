import { json } from '@sveltejs/kit';
import { getDocument, removeDocument, updateDocument } from '$lib/documents.js';
import { getVersionsList, removeObject } from '$lib/s3.js';
import { Bucket } from 'sst/node/bucket';

export async function POST({ request, params }) {
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
}

export async function GET({ params }) {
	const { id } = params;

	const document = await getDocument(id);

	if (document) {
		const response = await getVersionsList({
			key: document.key,
			bucket: Bucket.uploads.bucketName
		});

		return json({ versions: response }, { status: 200 });
	}

	return json(
		{
			message: 'Not Found.',
			versions: []
		},
		{ status: 404 }
	);
}

export async function DELETE({ params }) {
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
}
