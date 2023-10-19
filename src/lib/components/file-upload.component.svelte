<script>
	import clsx from 'clsx';
	import Loader from './loader.component.svelte'
        ;
	/**@type {string}*/
	export let name;

	/**@type {boolean}*/
	export let multiple = false;

	/**@type {boolean}*/
	let active = false;

	/**@type {boolean}*/
	export let loading = false;
</script>

<div
	class={clsx(
		active && 'relative border-blue-400',
		'grid h-[100px] w-full cursor-pointer place-items-center rounded border-2 border-dashed border-cyan-50'
	)}
>
	{#if loading}
		<Loader />
	{:else}
		<p class={clsx(active && 'text-blue-400', 'm-0 font-semibold')}>
			Upload file{multiple ? 's' : ''} or drag and drop
		</p>
	{/if}
	<input
		class="absolute left-0 top-0 z-[1] h-[100px] w-full cursor-pointer bg-red-300 opacity-0 disabled:!opacity-0"
		{multiple}
		{name}
		on:change
		on:dragleave={(event) => {
			event.preventDefault();
			active = false;
		}}
		on:dragover={(event) => {
			event.preventDefault();
			active = true;
		}}
		on:drop={() => {
			active = false;
		}}
		type="file"
	/>
</div>
