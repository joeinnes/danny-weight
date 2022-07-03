<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { directus } from '$lib/db';
	import { Chart, registerables } from 'chart.js';
	import 'chartjs-adapter-date-fns';
	import { enGB } from 'date-fns/locale/index.js';
	import {
		parse,
		format,
		startOfDay,
		endOfDay,
		differenceInHours,
		differenceInDays
	} from 'date-fns';
	import Bottle from '$lib/svgs/Bottle.svelte';

	Chart.register(...registerables);


	let chart;
	let myChart;

	let authenticated = false;
	let feeds = [];
	let rangeH = 0;
	let rangeD = 0;
	let earliest = null;
	let latest = null;

	let newFeed = {
		start_weight: 0,
		end_weight: 0
	};

	let filters = {
		start_date: null,
		end_date: new Date()
	};

	onMount(async () => {
		await directus.auth
			.refresh()
			.then(() => {
				authenticated = true;
				init();
			})
			.catch(() => {
				goto('/login');
			});
	});

	async function init() {
		const { data } = await directus.items('feeds').readByQuery({
			limit: -1,
			sort: ['date_created']
		});
		feeds = data;
		myChart = new Chart(chart, {
			type: 'line',
			data: {
				labels: feeds.map((el) => el.date_created),
				datasets: [
					{
						label: '',
						data: feeds.map((el) => el.end_weight),
						tension: 0.4,
						backgroundColor: '#000',
						borderColor: '#000',
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					tooltip: {
						enabled: false
					},
					legend: {
						display: false
					}
				},
				scale: [
					{
						adapters: {
							date: {
								locale: enGB
							}
						},
						grid: {
							drawTicks: false
						}
					}
				],
				scales: {
					x: {
						type: 'time',
						ticks: {
							source: 'auto'
						},
						time: {
							unit: 'day'
						}
					},
					y: {
						title: {
							display: true,
							padding: 10
						},
						ticks: {
							callback: function (value) {
								return value + ' g';
							}
						}
					}
				}
			}
		});
	}

	async function addNewFeed() {
		await directus.items('feeds').createOne(newFeed);
		init();
	}

	async function updateFilters() {
		const start_date = startOfDay(parse(filters.start_date, 'yyyy-MM-dd', 0));
		const end_date = endOfDay(parse(filters.end_date, 'yyyy-MM-dd', 0));
		const { data } = await directus.items('feeds').readByQuery({
			limit: -1,
			sort: ['date_created'],
			filter: {
				date_created: {
					_between: [start_date, end_date]
				}
			}
		});
		feeds = data;
		myChart.data.datasets[0].data = feeds.map((el) => el.end_weight);
		myChart.data.datasets[0].labels = feeds.map((el) => el.date_created);
		myChart.update();
	}

	$: {
		earliest = new Date([feeds.length - 1]?.date_created ?? Date.now());
		latest = new Date(feeds[0]?.date_created);
		rangeH = differenceInHours(earliest, latest);
		rangeD = differenceInDays(earliest, latest);
	}
</script>

<h1 class="flex items-center gap-4 text-4xl font-black py-8 px-8 neutral-content
">
	<div class="inline-block w-12 h-12">
		<svelte:component this={Bottle} />
	</div>
	Danny's Weight
</h1>
<div class="card bg-base-100 shadow-xl mx-auto w-full">
	<div class="card-body">
		<h3 class="card-title">New Feed</h3>
		<form on:submit|preventDefault={addNewFeed} class="flex gap-4">
			<div class="form-control w-full">
				<label for="start-weight" class="label">
					<span class="label-text">Start weight</span></label
				>
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
						class="input input-bordered input-lg w-full"
						bind:value={newFeed.end_weight}
					/>
					<span>g</span>
				</label>
			</div>

			<input type="submit" class="btn btn-lg btn-accent self-end" />
		</form>
		<small style="font-size: 0.7em"
			>Weights should be naked and clean - easiest way to do this is to weigh his clothes and nappy
			before putting him on, then subtract this from his start and end weight.</small
		>
	</div>
</div>
<div class="card bg-base-100 shadow-xl mx-auto w-full">
		<div class="card-body flex flex-col gap-4">
				<h3 class="card-title">Filter</h3>
		<form on:submit|preventDefault={updateFilters}>
			<div class="flex gap-4">
				<div class="form-control w-full">
					<label for="start-date" class="label"><span class="label-text">Start date</span> </label>
					<input type="date" id="start-date" name="start-date" bind:value={filters.start_date} class="input input-bordered input-lg"  />
				</div>
				<div class="form-control w-full">
					<label for="end-date" class="label"
						><span class="label-text">End date</span>
					</label><input type="date" id="end-date" name="end-date" bind:value={filters.end_date} class="input input-bordered input-lg" />
					
				</div>
				<input type="submit" class="btn btn-lg self-end btn-accent" value="Filter" />
			</div>
		</form>
		
{#if feeds.length}
	<div class="stats my-0">
			<div class="stat">
				<div class="stat-title">Latest Weight</div>
				<div class="stat-value">
					{feeds[feeds.length - 1]?.end_weight}g
				</div>
				<div class="stat-desc">
					At {new Date(feeds[feeds.length - 1]?.date_created).toLocaleString('en-GB')}
				</div>
			</div>
			<div class="stat">
				<div class="stat-title">Total Gain</div>
				<div class="stat-value">
					{feeds.reduce((acc, curr) => acc + curr.end_weight, 0) -
						feeds.reduce((acc, curr) => acc + curr.start_weight, 0)}g
				</div>
				<div class="stat-desc">All weight gains ignoring losses</div>
			</div>
			<div class="stat">
				<div class="stat-title">Net Gain</div>
				<div class="stat-value">
					{feeds[feeds.length - 1]?.end_weight - feeds[0]?.start_weight}g
				</div>
				<div class="stat-desc">
					Measured over {(rangeH / 24).toFixed(2)}
					{rangeD === 1 ? 'day' : 'days'}
				</div>
			</div>
			<div class="stat">
				<div class="stat-title">Daily Gain</div>
				<div class="stat-value">
					{Math.round(
						(feeds[feeds.length - 1]?.end_weight - feeds[0]?.start_weight) / (rangeH / 24)
					)}g
				</div>
				<div class="stat-desc">Average daily weight change</div>
			</div>

			<div class="stat">
				<div class="stat-title">Weekly Gain</div>
				<div class="stat-value">
					{Math.round(
						(7 * (feeds[feeds.length - 1]?.end_weight - feeds[0]?.start_weight)) /
							(differenceInHours(
								new Date([feeds.length - 1]?.date_created ?? Date.now()),
								new Date(feeds[0]?.date_created)
							) /
								24)
					)}g
				</div>
				<div class="stat-desc">Average weekly weight change</div>
			</div>
		</div>
{/if}
		<div>
			<canvas bind:this={chart} />
		</div>
{#if feeds.length}

		<div class="overflow-x-auto">
			<table class="table table-zebra w-full">
				<thead>
					<tr>
						<th scope="col"> Feed Date/Time </th>
						<th scope="col"> Feed Start Weight </th>
						<th scope="col"> Feed End Weight </th>
						<th scope="col"> Net Gain </th>
					</tr>
				</thead>
				<tbody>
					{#each feeds.reverse() as feed}
						<tr>
							<td
								>{new Date(feed.date_created).toLocaleString('en-GB', {
									weekday: 'short',
									year: 'numeric',
									month: 'short',
									day: '2-digit',
									hour: '2-digit',
									minute: '2-digit'
								})}</td
							>
							<td>{feed.start_weight}g</td>
							<td>{feed.end_weight}g</td>
							<td>{feed.end_weight - feed.start_weight}g</td>
						</tr>
					{:else}
						<tr>
							<td colspan="4">No data</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		{/if}
	</div>
</div>

<style>
	input::-webkit-inner-spin-button {
		opacity: 1;
	}

	.card {
		@apply my-4;
	}
</style>
