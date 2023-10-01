import { json } from '@sveltejs/kit';
import { getDocument, updateDocument } from '$lib/documents.js';
import { getVersionsList } from '$lib/s3.js';
import { BUCKET_NAME } from '$env/static/private';

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
			bucket: BUCKET_NAME
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
