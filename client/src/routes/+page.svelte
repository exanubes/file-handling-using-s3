<script>
	import { enhance } from '$app/forms';
	import { uploadToS3 } from '$lib/upload-to-s3.js';
	import { saveUploadedDocuments } from '$lib/api.js';
	export let data;

    let form;

	function handleSubmit({ formData }) {
		const files = [...formData.getAll('files')];
		formData.delete('files');
		files.forEach((file) => {
			formData.append('files', file.name);
		});

		return async ({ update, result }) => {
			update();
			if (result.type === 'success') {
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
			}
		};
	}

	function downloadDocument(id) {
		return async () => {
			console.log(id)
			const response = await fetch(`/?id=${id}`);
			const data = await response.json();
			console.log(data)
			const link = document.createElement('a');
			link.href = data.signedUrl;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
</script>

<form action="?/upload" method="POST" use:enhance={handleSubmit} bind:this={form}>
	<input type="file" name="files" multiple on:change={() => form.requestSubmit()} />
</form>

<div class="space-y-2">
	{#each data.documents as document}
		<div>
			<p>{document.name}</p>
			<button on:click={downloadDocument(document.id)}>download</button>
		</div>
	{/each}
</div>
