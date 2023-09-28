import { createPostUrl } from '$lib/s3.js';
import { BUCKET_NAME } from '$env/static/private';
import { listDocuments } from '$lib/documents.js';

/**@type {import('./$types').PageServerLoad}*/
export async function load() {
	const documents = await listDocuments();
	return { documents };
}

/** @type {import('./$types').Actions} */
export const actions = {
	async upload({ request }) {
		const data = await request.formData();
		const fileNames = data.getAll('files');

		const results = await Promise.all(
			fileNames.map((file) =>
				createPostUrl({
					bucket: BUCKET_NAME,
					key: crypto.randomUUID(),
					fileName: file
				})
			)
		);

		return {
			presignedUrls: results
		};
	}
};
