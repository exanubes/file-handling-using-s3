import { createPostUrl } from '$lib/s3';
import { listDocuments } from '$lib/documents';
import { Bucket } from 'sst/node/bucket';
import type { Actions, PageServerLoad } from './$types';
import type { Document } from '$lib/types/document.types';

export const load = async function load() {
	const documents = await listDocuments();
	return { documents };
} satisfies PageServerLoad<{ documents: Document[] }>;

export const actions: Actions = {
	async upload({ request }) {
		const data = await request.formData();
		const fileNames = data.getAll('files') as string[];

		const results = await Promise.all(
			fileNames.map((file) =>
				createPostUrl({
					bucket: Bucket.uploads.bucketName,
					key: crypto.randomUUID(),
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
		const name = data.get('name') as string;
		const key = data.get('key') as string;
		if (!key || !name) {
			return {
				error: 'name and key cannot be null',
				presignedUrl: null
			};
		}
		const result = await createPostUrl({
			bucket: Bucket.uploads.bucketName,
			fileName: name,
			key
		});

		return {
			presignedUrl: result
		};
	}
};
