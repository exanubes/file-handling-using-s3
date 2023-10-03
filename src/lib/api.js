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

export function confirmNewVersion(id, body) {
	return fetch(`/documents/${id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
}
