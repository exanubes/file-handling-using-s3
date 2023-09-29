import { createDocument, getDocument } from '$lib/documents.js';
import { json } from '@sveltejs/kit';
import { BUCKET_NAME } from '$env/static/private';
import { createDownloadUrl } from '$lib/s3.js';

/**@type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { files } = await request.json();

	const response = await Promise.all(
		files.map(async (file) => {
			const id = await createDocument(file);

			return {
				id,
				...file
			};
		})
	);

	return json(
		{
			message: 'created',
			data: response
		},
		{ status: 201 }
	);
}

/**@type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const id = url.searchParams.get('id');

	const document = await getDocument(id);

	if (document) {
		const response = await createDownloadUrl({
			key: document.key,
			bucket: BUCKET_NAME
		});
		return json({ signedUrl: response }, { status: 200 });
	}

	return json({ signedUrl: null }, { status: 404 });
}