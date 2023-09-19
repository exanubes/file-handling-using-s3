// @ts-nocheck
import { createPostUrl } from '$lib/s3.js';
import { v4 } from 'uuid';
import { listDocuments } from '$lib/documents.js';
import { Bucket } from 'sst/node/bucket';

/***/
export async function load() {
	const documents = await listDocuments();

	return {
		documents
	};
}

/** */
export const actions = {
	async upload({ request }) {
		const data = await request.formData();
		const files = data.getAll('files');
		/**@type {import('@aws-sdk/s3-presigned-post').PresignedPost[]}*/
		const results = await Promise.all(
			files.map((file) =>
				createPostUrl({
					bucket: Bucket.UploadedFiles.bucketName,
					key: v4(),
					fileName: file
				})
			)
		);

		return {
			presignedUrls: results
		};
	},

	async update({ request }) {
		const data = await request.formData();
		const key = data.get('key');
		const name = data.get('name');
		if (!key) {
			return {
				error: 'key cannot be null',
				presignedUrl: null
			};
		}

		const result = await createPostUrl({
			bucket: Bucket.UploadedFiles.bucketName,
			key,
			fileName: name
		});

		return {
			presignedUrl: result
		};
	}
};
