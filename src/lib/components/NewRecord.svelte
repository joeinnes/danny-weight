<script lang="ts">
	import NewFeed from '$lib/components/NewFeed.svelte';
	import BabyBottleOutline from 'svelte-material-icons/BabyBottleOutline.svelte';
	import HumanBabyChangingTable from 'svelte-material-icons/HumanBabyChangingTable.svelte';
	import Plus from 'svelte-material-icons/Plus.svelte';
	let modalOpen = false;
	let form: any;

	const openForm = (formToOpen: string) => {
		switch (formToOpen) {
			case 'NewFeed':
				form = NewFeed;
				break;
			default:
				form = null;
		}
		modalOpen = true;
	};

	const closeModal = () => {
		modalOpen = false;
		form = null;
		return void 0;
	};
	let hover = {
		feed: false,
		change: false
	};
</script>

<div class="dropdown dropdown-top dropdown-end fixed bottom-4 right-4 text-xl">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label tabindex="0" class="btn btn-neutral btn-lg text-4xl btn-circle	m-1"><Plus /></label>
	<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-64">
		<!-- svelte-ignore a11y-missing-attribute -->
		<li on:click={() => openForm('NewFeed')}>
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<a
				on:mouseover={() => (hover.feed = true)}
				on:focus={() => (hover.feed = true)}
				on:mouseout={() => (hover.feed = false)}
				on:blur={() => (hover.feed = false)}
				><label class="swap swap-rotate">
					<input type="checkbox" bind:checked={hover.feed} />
					<div class="swap-off text-3xl"><BabyBottleOutline /></div>
					<div class="swap-on text-3xl"><Plus /></div>
				</label>
				New Feed</a
			>
		</li>
		<li on:click={() => openForm('Change')}>
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<!-- svelte-ignore a11y-missing-attribute -->
			<a
				on:mouseover={() => (hover.change = true)}
				on:focus={() => (hover.change = true)}
				on:mouseout={() => (hover.change = false)}
				on:blur={() => (hover.change = false)}
				><label class="swap swap-rotate">
					<input type="checkbox" bind:checked={hover.change} />
					<div class="swap-off text-3xl"><HumanBabyChangingTable /></div>
					<div class="swap-on text-3xl"><Plus /></div>
				</label>
				Changed Nappy</a
			>
		</li>
	</ul>
</div>

<div class="modal" class:modal-open={modalOpen}>
	<div class="modal-box">
		{#key form}
			<svelte:component this={form} {closeModal} />
		{/key}
	</div>
</div>
