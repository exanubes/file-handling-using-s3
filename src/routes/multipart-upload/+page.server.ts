import { listDocuments } from '$lib/documents';
import type { Actions, PageServerLoad } from './$types';
import { getMultipartUrls, startMultipartUpload } from '$lib/s3';
import { Bucket } from 'sst/node/bucket';

export const load = async function load() {
	const documents = await listDocuments();

	return {
		documents
	};
} satisfies PageServerLoad;

export const actions: Actions = {
	async upload({ request }) {
		const data = await request.formData();
		const parts = await data.get('parts');
		const key = crypto.randomUUID();

		const response = await startMultipartUpload({
			bucket: Bucket.uploads.bucketName,
			key
		});

		const urls = await getMultipartUrls({
			bucket: Bucket.uploads.bucketName,
			uploadId: String(response.UploadId),
			parts: Number(parts),
			key
		});

		return {
			urls,
			key,
			uploadId: response.UploadId
		};
	}
};
