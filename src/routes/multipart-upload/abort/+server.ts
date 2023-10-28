import type { RequestHandler } from './$types';
import { abortMultipartUpload } from '$lib/s3';
import { Bucket } from 'sst/node/bucket';
import { json } from '@sveltejs/kit';

export const POST = async function POST({ request }) {
	const { uploadId, key } = await request.json();

	await abortMultipartUpload({
		key,
		uploadId,
		bucket: Bucket.uploads.bucketName
	});

	return json(null, { status: 200 });
} satisfies RequestHandler;
