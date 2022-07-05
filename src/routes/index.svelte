<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { directus } from '$lib/db';
	import { differenceInHours, differenceInDays } from 'date-fns';
	import { feeds, type Weight } from '$lib/stores/stores';

	import Bottle from '$lib/svgs/Bottle.svelte';
	import NewFeed from '$lib/components/NewFeed.svelte';
	import NewRecord from '$lib/components/NewRecord.svelte';
	import Chart from '$lib/components/Chart.svelte';
	import Table from '$lib/components/Table.svelte';
	import StatsPanel from '$lib/components/StatsPanel.svelte';
	import UpdateFilters from '$lib/components/UpdateFilters.svelte';

	let authenticated = false;

	onMount(async () => {
		await directus.auth
			.refresh()
			.then(async () => {
				authenticated = true;
				const { data } = await directus.items('feeds').readByQuery({
					limit: -1,
					sort: ['date_created']
				});
				$feeds = data as Weight[];
			})
			.catch(() => {
				goto('/login');
			});
	});
</script>

<h1
	class="flex items-center gap-4 text-4xl font-black py-8 px-8 neutral-content
"
>
	<div class="inline-block w-12 h-12">
		<svelte:component this={Bottle} />
	</div>
	Danny's Weight
</h1>
<div class="flex flex-col gap-4">
	{#if authenticated}
		<div class="card bg-base-100 shadow-xl mx-auto w-full">
			<div class="card-body flex flex-col gap-4">
				<UpdateFilters />
				{#if $feeds?.length}
					<StatsPanel />
					<Chart />
					<Table />
				{/if}
			</div>
		</div>
	{/if}
</div>
<NewRecord />
