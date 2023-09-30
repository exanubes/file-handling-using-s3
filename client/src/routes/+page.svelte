<script>
	import { enhance } from '$app/forms';
	import { uploadToS3 } from '$lib/upload-to-s3.js';
	import { saveUploadedDocuments } from '$lib/api.js';
	import FileUpload from '$lib/components/file-upload.component.svelte';
	import { invalidate } from '$app/navigation';

	/**@type {import('./$types').PageData}*/
	export let data;

	/**@type {HTMLFormElement}*/
	let form;

	/**@type {import('./$types').SubmitFunction}*/
	function handleSubmit({ formData }) {
		const files = [...formData.getAll('files')];
		formData.delete('files');
		files.forEach((file) => {
			formData.append('files', file.name);
		});

		return async ({ update, result }) => {
			update();
			if (result.type === 'success') {
				try {
					await Promise.all(
						result.data.presignedUrls.map((presignedUrl, index) =>
							uploadToS3(files[index], presignedUrl.url, presignedUrl.fields)
						)
					);

					await saveUploadedDocuments({
						files: result.data.presignedUrls.map((presignedUrl, index) => ({
							key: presignedUrl.fields.key,
							name: files[index].name
						}))
					});
				} catch (error) {
					alert(error);
				} finally {
					await invalidate('/');
				}
			}
		};
	}

	function downloadDocument(id) {
		return async () => {
			const response = await fetch(`/?id=${id}`);
			const data = await response.json();
			const link = document.createElement('a');
			link.href = data.signedUrl;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		};
	}
</script>

<form action="?/upload" method="POST" use:enhance={handleSubmit} bind:this={form}>
	<FileUpload multiple name="files" on:change={() => form.requestSubmit()} />
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
					class="text-green-600 hover:text-green-600"
					on:click={downloadDocument(document.id)}
				>
					download
				</button>
			</div>
		</div>
	{/each}
</div>
