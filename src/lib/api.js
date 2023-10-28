import { MINIMUM_PART_SIZE } from '$lib/const.js';

/**
 * @description sends a http POST request to save the file reference to the database
 * @param {{files: {name: string; key: string}[]}} body
 * */
export function saveUploadedDocuments(body) {
	return fetch('/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
}

/**
 * @description sends a http POST request to save changes to an existing database document
 * @param {string} id;
 * @param {{name: string}} body
 * */
export function confirmNewVersion(id, body) {
	return fetch(`/documents/${id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
}

/**
 * @description slice file into parts and upload each part using signed urls
 * @param {Blob} file
 * @param {string[]} signedUrls
 * */
export async function uploadPartsToS3(file, signedUrls) {
	return Promise.all(
		signedUrls.map(async (signedUrl, index) => {
			const start = index * MINIMUM_PART_SIZE;
			const end = (index + 1) * MINIMUM_PART_SIZE;
			const isLastPart = index === signedUrls.length - 1;
			const part = isLastPart ? file.slice(start) : file.slice(start, end);
			const response = await fetch(signedUrl, {
				method: 'PUT',
				body: part
			});

			/**@type {import('@aws-sdk/client-s3').CompletedPart}*/
			return {
				ETag: response.headers.get('etag'),
				PartNumber: index + 1
			};
		})
	);
}
