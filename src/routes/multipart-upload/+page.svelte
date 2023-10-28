<script>
	import { enhance } from '$app/forms';
	import FileUpload from '$lib/components/file-upload.component.svelte';
	import { MINIMUM_PART_SIZE, MINIMUM_SIZE_FOR_MULTIPART_UPLOAD } from '$lib/const.js';
	import { abortMultipartUpload, completeMultipartUpload, uploadPartsToS3 } from '$lib/api.js';
	import { invalidate } from '$app/navigation';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {HTMLFormElement}*/
	let form;

	/**@type {import('@sveltejs/kit').SubmitFunction}*/
	function handleSubmit({ formData }) {
		const file = formData.get('file');
		formData.delete('file');
		const isMultipart = file.size / MINIMUM_SIZE_FOR_MULTIPART_UPLOAD > 1;
		if (!isMultipart) alert('not big enough');
		formData.set('parts', Math.floor(file.size / MINIMUM_PART_SIZE));
		return async ({ update, result }) => {
			update();
			if (result.type === 'success') {
				try {
					const response = await uploadPartsToS3(file, result.data.urls);

					await completeMultipartUpload({
						uploadId: result.data.uploadId,
						key: result.data.key,
						name: file.name,
						uploadedParts: response
					});

					await invalidate('/multipart-upload');
				} catch (error) {
					await abortMultipartUpload({
						uploadId: result.data.uploadId,
						key: result.data.key
					});
					alert(error);
				}
			}
		};
	}

	/**
	 * @description download document by id
	 * @param {string} id
	 * @param {string?} version
	 * @returns {()=>void}
	 * */
	function downloadDocument(id, version) {
		return async () => {
			const query = new URLSearchParams({
				id
			});
			if (version) {
				query.append('version', version);
			}
			const response = await fetch(`/?${query}`);
			const data = await response.json();
			const link = document.createElement('a');
			link.href = data.signedUrl;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		};
	}
</script>

<form action="?/upload" bind:this={form} method="POST" use:enhance={handleSubmit}>
	<input name="parts" type="number" class="hidden" />
	<FileUpload
		name="file"
		on:change={() => {
			form.requestSubmit();
		}}
	/>
</form>

<div class="mx-4 mt-4 space-y-2">
	<h1 class="text-2xl">Documents:</h1>
	{#if !data.documents.length}
		<p>No documents yet.</p>
	{/if}
	{#each data.documents as document}
		<div class="flex justify-between gap-4 border-b p-2">
			<p class="truncate font-medium">{document.name}</p>
			<div class="flex gap-4">
				<button
					disabled={document.deleted}
					class="flex items-center gap-1 text-green-600 hover:text-green-600 disabled:cursor-not-allowed disabled:text-gray-400"
					on:click={downloadDocument(document.id)}
				>
					<span>download</span>
				</button>
			</div>
		</div>
	{/each}
</div>
