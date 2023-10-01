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
</script>

<div class="flex w-full gap-2 rounded-sm pl-4 hover:bg-blue-50">
	<div
		tabindex="0"
		role="button"
		style={{ all: 'unset' }}
		on:click={version.deleted ? undefined : onDownload}
		on:keydown={handleKeyDown}
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
	</div>
</div>
