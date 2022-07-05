<script lang="ts">
	import NewFeed from '$lib/components/NewFeed.svelte';
	let modalOpen = false;
	let form: any;

	const openForm = (formToOpen: string) => {
		switch (formToOpen) {
			case 'NewFeed':
				form = NewFeed;
		}
		modalOpen = true;
	};

	const closeModal = () => {
		modalOpen = false;
		form = null;
		return void 0;
	};
</script>

<div class="dropdown dropdown-top dropdown-end fixed bottom-4 right-4">
	<label tabindex="0" class="btn btn-neutral m-1" for="">Click</label>
	<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
		<!-- svelte-ignore a11y-missing-attribute -->
		<li on:click={() => openForm('NewFeed')}><a>New Feed</a></li>
	</ul>
</div>

<div class="modal" class:modal-open={modalOpen}>
	<div class="modal-box">
		{#key form}
			<svelte:component this={form} {closeModal} />
		{/key}
	</div>
</div>
