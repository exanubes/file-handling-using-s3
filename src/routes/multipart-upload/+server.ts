import type { RequestHandler } from './$types';
import { completeMultipartUpload } from '$lib/s3';
import { Bucket } from 'sst/node/bucket';
import { createDocument } from '$lib/documents';
import { json } from '@sveltejs/kit';
export const POST = async function POST({ request }) {
	const { uploadId, key, name, uploadedParts } = await request.json();

	await completeMultipartUpload({
		bucket: Bucket.uploads.bucketName,
		parts: uploadedParts,
		uploadId,
		key
	});
	const id = await createDocument({ key, name });
	const response = { id, key, name };

	return json({ message: 'created', data: response }, { status: 201 });
} satisfies RequestHandler;
