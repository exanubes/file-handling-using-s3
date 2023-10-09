import { getDocument, restoreDocument } from '$lib/documents.js';
import { json } from '@sveltejs/kit';
import { Bucket } from 'sst/node/bucket';
import { restoreObject } from '$lib/s3.js';
import type { RequestHandler } from './$types';

export const POST = async function POST({ request, params }) {
	const data = await request.json();
	const { id } = params;

	const document = await getDocument(id);
	if (!document) return json({ message: 'document not found' }, { status: 404 });

	await restoreObject({
		bucket: Bucket.uploads.bucketName,
		key: document.key,
		versionId: data.versionId
	});

	await restoreDocument({
		version: data.versionId,
		key: document.key
	});

	return json({ message: 'accepted' }, { status: 202 });
} satisfies RequestHandler;
