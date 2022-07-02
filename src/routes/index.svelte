<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { directus } from '$lib/db';
	import Line from "svelte-chartjs/src/Line.svelte"
	import { Chart, registerables } from 'chart.js';
	import {enGB} from 'date-fns/locale';
	import {parse, format, startOfDay, endOfDay} from 'date-fns';
	import Bottle from '$lib/svgs/Bottle.svelte';

	import 'chartjs-adapter-date-fns';

	Chart.register(...registerables)
	let chart;
	let myChart;

	let authenticated = false;
	let feeds = [];

	let newFeed = {
		start_weight: 0,
		end_weight: 0
	}

	let filters = {
		start_date: null,
		end_date: new Date()
	}

	onMount(async () => {
		await directus.auth
			.refresh()
			.then(() => {
				authenticated = true;
				init();
			})
			.catch(() => { goto('/login') });
		}
	)

	async function init() {
		const { data } = await directus.items('feeds').readByQuery({
			limit: -1,
			sort: ['date_created']
		})
		feeds = data;
		myChart = new Chart(chart, {
			type: 'line',
			data: {
				labels: feeds.map(el => el.date_created),
				datasets: [{
					label: '',
					data: feeds.map(el => el.end_weight),
					tension: 0.4,
					backgroundColor: '#000',
					borderColor: '#000'
				}]
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
				scale: [{
    			adapters: {
        		date: {
            	locale: enGB
        		}
    			}, 
					grid: {
						drawTicks: false
					}
				}],
				scales: {
					x: {
						type: 'time',
						ticks: {
							source:'auto'
						},
						time: {
							unit: 'day'
						},
					},
					y: {
						title: {
							display: true,
							padding: 10
						},
						ticks: {
							callback: function(value) {
									return value + ' g';
							}
						}
					}
        }
			}
		})
	}

	async function addNewFeed() {
		await directus.items('feeds').createOne(newFeed);
		init();
	}

	async function updateFilters() {
		const start_date = startOfDay(parse(filters.start_date, 'yyyy-MM-dd', 0));
		const end_date = endOfDay(parse(filters.end_date, 'yyyy-MM-dd', 0));
		const {data} = await directus.items('feeds').readByQuery({
			limit: -1,
			sort: ['date_created'],
			filter: {
				"date_created": {
					"_between": [start_date, end_date]
				}
			}
		})
		feeds = data;
		myChart.data.datasets[0].data = feeds.map(el => el.end_weight);
		myChart.data.datasets[0].labels = feeds.map(el => el.date_created);
		myChart.update();
	}
</script>

<h1 style="margin-bottom: 0"><div style="height: 1em; width: 1em; display: inline-block; margin-right: 1rem;"><svelte:component this={Bottle} /></div>Danny Weight</h1>
<article>
<h3 style="margin-bottom: 0">New Feed</h3>
<form on:submit|preventDefault={addNewFeed} style="margin-bottom: 0">
	<div class="grid">
		<label for="start-weight">Start weight<input type="number" id="start-weight" name="start-weight" bind:value={newFeed.start_weight}/><span style="position: relative; display: inline; margin-left: -5ch;">g</span></label>
		<label for="end-weight">End weight<input type="number" id="end-weight" name="end-weight"bind:value={newFeed.end_weight} /><span style="position: relative; display: inline; margin-left: -5ch;">g</span></label>
		<label for="submit">&nbsp;
		<input type="submit" />
		</label>
	</div>
</form>
<small style="font-size: 0.7em">Weights should be naked and clean - easiest way to do this is to weigh his clothes and nappy before putting him on, then subtract this from his start and end weight.</small>
</article>
{#if feeds.length}
<article class="grid">
<div>
	<h2 style="margin-bottom: 0">Total Gain</h2>
	{feeds.reduce((acc, curr) => acc + curr.end_weight, 0) - feeds.reduce((acc, curr) => acc + curr.start_weight, 0) }g
	</div>
	<div>
	<h2 style="margin-bottom: 0">Net Gain</h2>
	{feeds[feeds.length-1]?.end_weight - feeds[0]?.start_weight}g
	</div>
	</article>
{/if}
<article>
<h3 style="margin-bottom: 0">Filter</h3>
<form on:submit|preventDefault={updateFilters}>
	<div class="grid">
		<label for="start-date">Start date<input type="date" id="start-date" name="start-date" bind:value={filters.start_date}/></label>
		<label for="end-date">End date<input type="date" id="end-date" name="end-date" bind:value={filters.end_date} /></label>
		<label for="submit">&nbsp;
		<input type="submit" />
		</label>
	</div>
</form>
<div>
	<canvas bind:this={chart}></canvas>
	</div>
</article>
<article>
<table role="grid">
  <thead>
    <tr>
			<th scope="col">
				Feed Date/Time
			</th>
			<th scope="col">
				Feed Start Weight
			</th>
			<th scope="col">
				Feed End Weight
			</th>
			<th scope="col">
				Net Gain
			</th>
		</tr>
	</thead>
	<tbody>
	 	{#each feeds.reverse() as feed}
			<tr>
				<td>{new Date(feed.date_created).toLocaleString('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour:'2-digit', minute:'2-digit' })}</td>
				<td>{feed.start_weight}</td>
				<td>{feed.end_weight}</td>
				<td>{feed.end_weight - feed.start_weight}</td>
			</tr>
			{:else}
			<tr>
			<td colspan="4">No data</td>
			</tr>
		{/each}
	</tbody>
</table>
</article>

<style>
input::-webkit-inner-spin-button {
	opacity: 1;
}
</style>