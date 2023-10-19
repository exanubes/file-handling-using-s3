<script>
	export const range = (size, startAt = 0) => [...Array(size).keys()].map((i) => i + startAt);

	export let color = '#FF3E00';
	export let unit = 'px';
	export let duration = '1.2s';
	export let size = '60';
	export let pause = false;
	let durationUnit = 's';
	let durationNum = duration.replace(durationUnit, '');
</script>

<div class="wrapper" style="--size: {size}{unit}; --color: {color}; --duration: {duration}">
	{#each range(5, 1) as version}
		<div
			class="rect bg-cyan-600"
			class:pause-animation={pause}
			style="animation-delay: {(version - 1) * (+durationNum / 12)}{durationUnit}"
		/>
	{/each}
</div>

<style>
	.wrapper {
		height: var(--size);
		width: var(--size);
		display: inline-block;
		text-align: center;
		font-size: 10px;
	}
	.rect {
		height: 100%;
		width: 10%;
		display: inline-block;
		margin-right: 4px;
		transform: scaleY(0.4);
		animation: stretch var(--duration) ease-in-out infinite;
	}
	.pause-animation {
		animation-play-state: paused;
	}
	@keyframes stretch {
		0%,
		40%,
		100% {
			transform: scaleY(0.4);
		}
		20% {
			transform: scaleY(1);
		}
	}
</style>
