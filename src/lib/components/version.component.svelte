<script>
	import clsx from 'clsx';
	import { format } from 'date-fns';

	/**@type {string}*/
	export let documentId;

	/**
     *@type {{
        type: string;
        key: string;
        lastModified: string;
        versionId: string;
        isLatest: boolean;
        deleted: boolean;
        restoredUntil: string | null;
        restoredStatus: 'completed' | 'pending' | null;
        isArchived: boolean;
     }}
     */
	export let version;

	/**@type {()=>void}*/
	export let onDownload;

	function handleKeyDown(event) {
		const shouldTrigger = event.code === 'Space' || event.code === 'Enter';
		if (shouldTrigger) {
			void onDownload();
		}
	}
	let restoring = false;
	/**@description Request retrieving an archived document
	 * @param {string} versionId */
	function handleRestore(versionId) {
		return async () => {
			await fetch(`/documents/${documentId}/restore`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ versionId })
			});
			restoring = true;
		};
	}

	const isArchived = version.isArchived && !version.restoredUntil;
</script>

<div class="flex w-full gap-2 rounded-sm pl-4 hover:bg-blue-50">
	<div
		tabindex="0"
		role="button"
		style={{ all: 'unset' }}
		on:click={isArchived || version.deleted ? undefined : onDownload}
		on:keydown={isArchived || version.deleted ? undefined : handleKeyDown}
	>
		<p
			class={clsx(
				'font-semibold',
				version.isLatest && 'text-green-400',
				version.deleted ? 'cursor-default' : 'cursor-pointer hover:underline'
			)}
		>
			{format(new Date(version.lastModified), 'MMM do, yyyy')}
		</p>
	</div>
	<div class="flex grow items-center justify-between">
		{#if version.deleted}
			<small class="italic text-red-400">deleted</small>
		{/if}
		{#if version.isArchived}
			{#if version.restoredStatus === 'completed'}
				<small
					>restored until {format(new Date(version.restoredUntil), 'MMM do, yyyy HH:mma')}</small
				>
			{:else if version.restoredStatus === 'pending' || restoring}
				<small class="italic text-yellow-500">restoring...</small>
			{:else}
				<small class="italic text-gray-300">archived</small>
				<button on:click={handleRestore(version.versionId)}>restore</button>
			{/if}
		{/if}
	</div>
</div>
