import { createDocument, getDocument } from '$lib/documents.js';
import { json } from '@sveltejs/kit';
import { Bucket } from 'sst/node/bucket';
import { createDownloadUrl } from '$lib/s3.js';
import type { RequestHandler } from './$types';

export const POST = async function POST({ request }) {
	const { files }: PostBody = await request.json();

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
} satisfies RequestHandler;

export const GET = async function GET({ url }) {
	const id = url.searchParams.get('id');
	const version = url.searchParams.get('version');

	if (!id) return json({ signedUrl: null }, { status: 400 });

	const document = await getDocument(id);
	if (!document) return json({ signedUrl: null }, { status: 404 });

	const response = await createDownloadUrl({
		key: document.key,
		bucket: Bucket.uploads.bucketName,
		version
	});
	return json({ signedUrl: response }, { status: 200 });
} satisfies RequestHandler;

interface PostBody {
	files: { name: string; key: string }[];
}
