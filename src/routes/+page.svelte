<script>
	import { enhance } from '$app/forms';
	import { uploadToS3 } from '$lib/upload-to-s3.js';
	import { confirmNewVersion, saveUploadedDocuments } from '$lib/api.js';
	import { invalidate } from '$app/navigation';
	import FileUpload from '$lib/components/file-upload.component.svelte';
	import Modal from '$lib/components/modal.component.svelte';
	import Version from '$lib/components/version.component.svelte';

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

	function downloadDocument(id, version) {
		return async () => {
			const query = new URLSearchParams({ id });
			if (version) {
				query.set('version', version);
			}

			try {
				const response = await fetch(`/?${query}`);
				const data = await response.json();
				const link = document.createElement('a');
				link.href = data.signedUrl;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			} catch (error) {
				alert(error);
			}
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
				try {
					await uploadToS3(file, result.data.presignedUrl.url, result.data.presignedUrl.fields);
					if (formName !== activeDocument.name || activeDocument.deleted) {
						await confirmNewVersion(activeDocument.id, { name: formName });
						await invalidate('/');
					}
				} catch (error) {
					alert(error);
				} finally {
					activeDocument = null;
				}
			}
		};
	}

	let versions = [];
	$: {
		if (activeDocument) {
			fetch(`/documents/${activeDocument.id}`)
				.then((res) => res.json())
				.then((res) => (versions = res.versions))
				.catch(alert);
		}
	}

	/**
	 * @param {string} id
	 * */
	function removeDocument(id) {
		return async () => {
			try {
				await fetch(`documents/${id}`, {
					method: 'DELETE'
				});

				await invalidate('/');
			} catch (error) {
				alert(error);
			}
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
					disabled={document.deleted}
					class="text-green-500 hover:text-green-600 disabled:cursor-not-allowed disabled:text-gray-400"
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
				<button
					disabled={document.deleted}
					class="text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:text-gray-400"
					on:click={removeDocument(document.id)}
				>
					remove
				</button>
			</div>
		</div>
	{/each}
</div>

<Modal bind:showModal={activeDocument}>
	<div class="space-y-4">
		<h2 class="text-2xl">History:</h2>
		{#if !versions.length}
			<p>loading...</p>
		{:else}
			{#each versions as version}
				<Version
					documentId={activeDocument.id}
					onDownload={downloadDocument(activeDocument.id, version.versionId)}
					{version}
				/>
			{/each}
		{/if}
		<hr class="my-2" />
		<h2 class="text-2xl">Upload new file version</h2>
		<form action="?/update" use:enhance={handleUpdate} method="POST">
			<div class="flex gap-4">
				<input name="key" value={activeDocument?.key} class="hidden" />
				<input name="name" value={activeDocument?.name} class="rounded-sm border px-1" />
				<input type="file" name="file" />
			</div>
			<button
				type="submit"
				class="mb-1 ml-auto mt-6 block rounded bg-blue-500 px-4 py-2 text-white"
			>
				Upload
			</button>
		</form>
	</div>
</Modal>
