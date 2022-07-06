<script lang="ts">
	import { feeds, type Weight } from '$lib/stores/stores';
	import { parse, sub, format } from 'date-fns';
	import { directus } from '$lib/db';

	let filters = {
		start_date: new Date(0).toISOString(),
		end_date: new Date().toISOString()
	};

	const setFilters = async (time: string) => {
		const now = new Date();
		filters.end_date = format(new Date(), "yyyy-MM-dd'T'HH:mm");
		switch (time) {
			case '1d':
				filters.start_date = format(sub(now, { hours: 24 }), "yyyy-MM-dd'T'HH:mm");
				break;
			case '3d':
				filters.start_date = format(sub(now, { hours: 72 }), "yyyy-MM-dd'T'HH:mm");
				break;
			case '7d':
				filters.start_date = format(sub(now, { weeks: 1 }), "yyyy-MM-dd'T'HH:mm");
				break;
			case '14d':
				filters.start_date = format(sub(now, { weeks: 2 }), "yyyy-MM-dd'T'HH:mm");
				break;
			case '1mo':
				filters.start_date = format(sub(now, { months: 1 }), "yyyy-MM-dd'T'HH:mm");
				break;
			default:
				filters = {
					start_date: format(new Date(2022, 5, 20, 16, 24), "yyyy-MM-dd'T'HH:mm"),
					end_date: format(now, "yyyy-MM-dd'T'HH:mm")
				};
		}
		updateFilters();
	};

	const updateFilters = async () => {
		const start_date = parse(filters.start_date, "yyyy-MM-dd'T'HH:mm", 0);
		const end_date = parse(filters.end_date, "yyyy-MM-dd'T'HH:mm", 0);
		const { data } = await directus.items('feeds').readByQuery({
			limit: -1,
			sort: ['date_created'],
			filter: {
				date_created: {
					_between: [start_date, end_date]
				}
			}
		});
		$feeds = data as Weight[];
	};
</script>

<form on:submit|preventDefault={updateFilters}>
	<div class="flex gap-4 flex-col md:flex-row mb-4">
		<div class="form-control w-full">
			<label for="start-date" class="label"><span class="label-text">Start date</span> </label>
			<input
				type="datetime-local"
				id="start-date"
				name="start-date"
				bind:value={filters.start_date}
				class="input input-bordered input-lg"
			/>
		</div>
		<div class="form-control w-full">
			<label for="end-date" class="label"><span class="label-text">End date</span> </label><input
				type="datetime-local"
				id="end-date"
				name="end-date"
				bind:value={filters.end_date}
				class="input input-bordered input-lg"
			/>
		</div>
		<input
			type="submit"
			class="btn btn-lg btn-accent block md:inline-block md:self-end"
			value="Filter"
		/>
	</div>
	<div class="flex gap-2">
		<button class="btn" on:click={() => setFilters('1d')}>Last 24 hours</button>
		<button class="btn" on:click={() => setFilters('3d')}>Last 3 days</button>
		<button class="btn" on:click={() => setFilters('7d')}>Last 7 days</button>
		<button class="btn" on:click={() => setFilters('14d')}>Last 14 days</button>
		<button class="btn" on:click={() => setFilters('1mo')}>Last month</button>
		<div class="flex-1" />
		<button class="btn" on:click={() => setFilters('clear')}>Clear filter</button>
	</div>
</form>
