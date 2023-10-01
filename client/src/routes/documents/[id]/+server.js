import { json } from '@sveltejs/kit';
import { updateDocument } from '$lib/documents.js';

export async function POST({ request, params }) {
	const { name } = await request.json();
	const { id } = params;

	const response = await updateDocument({ id, name });

	return json(
		{
			message: 'updated',
			data: response
		},
		{ status: 200 }
	);
}
