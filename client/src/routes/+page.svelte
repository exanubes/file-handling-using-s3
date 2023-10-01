<script>
	import { enhance } from '$app/forms';
	import { uploadToS3 } from '$lib/upload-to-s3.js';
	import { confirmNewVersion, saveUploadedDocuments } from '$lib/api.js';
	import { invalidate } from '$app/navigation';
	import FileUpload from '$lib/components/file-upload.component.svelte';
	import Modal from '$lib/components/modal.component.svelte';

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
	let activeDocument;
	function handleUpdate({ formData }) {
		const file = formData.get('file');
		formData.delete('file');
		const formName = formData.get('name');
		return async ({ update, result }) => {
			update();
			if (result.type === 'success' && result.data.presignedUrl) {
				await uploadToS3(file, result.data.presignedUrl.url, result.data.presignedUrl.fields);
				if (formName !== activeDocument.name) {
					await confirmNewVersion(activeDocument.id, { name: formName });
					await invalidate('/');
				}
				activeDocument = null;
			}
		};
	}

	let versions = [];
	$: {
		if (activeDocument) {
			fetch(`/documents/${activeDocument.id}`)
				.then((res) => res.json())
				.then((res) => (versions = res.versions));
		}
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
					class="text-green-500 hover:text-green-600"
					on:click={downloadDocument(document.id)}
				>
					download
				</button>
				<button
					class="text-blue-500 hover:text-blue-600"
					on:click={() => (activeDocument = document)}
				>
					edit
				</button>
			</div>
		</div>
	{/each}
</div>

<Modal bind:showModal={activeDocument}>
	<form action="?/update" use:enhance={handleUpdate} method="POST">
		<input name="key" value={activeDocument?.key} class="hidden" />
		<input name="name" value={activeDocument?.name} />
		<input type="file" name="file" multiple />
		<button type="submit"> Upload </button>
	</form>
</Modal>
