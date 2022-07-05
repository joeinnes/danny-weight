<script lang="ts">
	import { feeds, type Weight } from '$lib/stores/stores';
	import { directus } from '$lib/db';

	export let closeModal = () => void 0;

	let weightEstimate = 0;

	let newFeed = {
		start_weight: 0,
		end_weight: 0,
		estimated: false
	};
	let activeTab: 'weighed' | 'unweighed' = 'weighed';

	const getLatestFeed = async () => {
		const { data } = await directus.items('feeds').readByQuery({
			limit: 1,
			sort: ['-date_created']
		});
		return data;
		return null;
	};

	async function addNewFeed() {
		if (newFeed.estimated) {
			const latestFeed = await getLatestFeed();
			/* If estimating, assume that the weight increase is equivalent to half of the estimated feed */
			if (!latestFeed || !latestFeed.length) {
				throw "You can't estimate without a previous feed";
			} else {
				const latestWeight = latestFeed[0].end_weight;
				if (!latestWeight) {
					throw "You can't estimate without a previous feed";
				}
				newFeed.start_weight = latestWeight - weightEstimate / 2;
				newFeed.end_weight = latestWeight + weightEstimate / 2;
			}
		}
		await directus.items('feeds').createOne(newFeed);
		const { data } = await directus.items('feeds').readByQuery({
			limit: -1,
			sort: ['date_created']
		});
		$feeds = data as Weight[];
	}
</script>

<h3 class="card-title">New Feed</h3>
<div class="flex justify-center">
	<div class="tabs">
		<!-- svelte-ignore a11y-missing-attribute -->
		<a
			class:tab-active={activeTab === 'weighed'}
			class="tab tab-bordered"
			on:click={() => {
				activeTab = 'weighed';
				newFeed.estimated = false;
			}}>Weighed</a
		>
		<!-- svelte-ignore a11y-missing-attribute -->
		<a
			class:tab-active={activeTab === 'unweighed'}
			class="tab tab-bordered tab-active"
			on:click={() => {
				activeTab = 'unweighed';
				newFeed.estimated = true;
			}}>Unweighed</a
		>
	</div>
</div>
<form on:submit|preventDefault={addNewFeed} class="flex flex-col gap-4">
	{#if activeTab === 'weighed'}
		<div class="form-control w-full">
			<label for="start-weight" class="label"> <span class="label-text">Start weight</span></label>
			<label class="input-group">
				<input
					type="number"
					id="start-weight"
					name="start-weight"
					class="input input-bordered input-lg w-full"
					bind:value={newFeed.start_weight}
				/>
				<span>g</span>
			</label>
		</div>
		<div class="form-control w-full">
			<label for="end-weight" class="label">
				<span class="label-text">End weight</span>
			</label>
			<label class="input-group">
				<input
					type="number"
					id="end-weight"
					name="end-weight"
					class="input input-bordered input-lg w-full "
					bind:value={newFeed.end_weight}
				/>
				<span>g</span>
			</label>
		</div>

		<small style="font-size: 0.7em"
			>Weights should be naked and clean - easiest way to do this is to weigh his clothes and nappy
			before putting him on, then subtract this from his start and end weight.</small
		>
	{:else if activeTab === 'unweighed'}
		{#await getLatestFeed()}
			<p>Loading...</p>
		{:then latestFeed}
			<div class="form-control w-full">
				<label for="weight-estimate" class="label">
					<span class="label-text">Estimated Feed</span>
				</label>
				<label class="input-group">
					<input
						type="number"
						id="weight-estimate"
						name="weight-estimate"
						class="input input-bordered input-lg w-full "
						bind:value={weightEstimate}
					/>
					<span>g</span>
				</label>
			</div>
		{/await}
	{/if}
	<div class="flex gap-2 justify-between">
		<button class="btn btn-lg btn-error" on:click|preventDefault|stopPropagation={closeModal}
			>Cancel</button
		>

		<input type="submit" class="btn btn-lg btn-accent" />
	</div>
</form>

<style>
	input::-webkit-inner-spin-button {
		opacity: 1;
	}
</style>
