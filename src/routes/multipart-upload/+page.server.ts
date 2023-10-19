import { listDocuments } from '$lib/documents';
import type { Actions, PageServerLoad } from './$types';

export const load = async function load() {
	const documents = await listDocuments();

	return {
		documents
	};
} satisfies PageServerLoad;

export const actions: Actions = {
	async upload({ request }) {
		const data = await request.formData();

		return {};
	}
};
