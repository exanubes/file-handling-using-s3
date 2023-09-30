<script>
    import clsx from 'clsx';

    /**@type {string}*/
    export let name;

    /**@type {boolean}*/
    export let multiple = false;

    /**@type {boolean}*/
    let active = false;
</script>

<div
        class={clsx(
		active && 'relative border-blue-400',
		'w-full h-[100px] rounded border-2 border-dashed border-cyan-50 grid place-items-center cursor-pointer'
	)}
>
    <p class={clsx(active && 'text-blue-400', 'font-semibold m-0')}>Upload files or drag and drop</p>
    <input
            class="w-full absolute top-0 left-0 h-[100px] z-[1] opacity-0 disabled:!opacity-0 cursor-pointer bg-red-300"
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
