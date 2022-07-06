<script lang="ts">
	import { differenceInHours, differenceInDays } from 'date-fns';
	import { feeds } from '$lib/stores/stores';

	let rangeH = 0;
	let rangeD = 0;
	let earliest;
	let latest;

	$: {
		if ($feeds && $feeds?.length) {
			earliest = new Date($feeds[$feeds?.length - 1].date_created);
			latest = new Date($feeds[0]?.date_created);
			rangeH = differenceInHours(earliest, latest);
			rangeD = differenceInDays(earliest, latest);
		}
	}
</script>

{#if $feeds?.length}
	<div class="grid grid-cols-2 xl:grid-cols-7 auto-cols-fr xl:divide-x items-center my-0">
		<div class="stat">
			<div class="stat-title">Latest Weight</div>
			<div class="stat-value">
				{$feeds[$feeds.length - 1]?.end_weight}g
			</div>
			<div class="stat-desc">
				At {new Date($feeds[$feeds.length - 1].date_created).toLocaleString('en-GB')}
			</div>
		</div>
		<div class="stat">
			<div class="stat-title">Average Feed</div>
			<div class="stat-value">
				{(
					($feeds.reduce((acc, curr) => acc + (curr?.end_weight || 0), 0) -
						$feeds.reduce((acc, curr) => acc + (curr?.start_weight || 0), 0)) /
					$feeds.length
				).toFixed(0)}g
			</div>
			<div class="stat-desc">Mean feed weight</div>
		</div>
		<div class="stat">
			<div class="stat-title">Net Gain</div>
			<div class="stat-value">
				{($feeds[$feeds.length - 1]?.end_weight || 0) - ($feeds[0]?.start_weight || 0)}g
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
					(($feeds[$feeds.length - 1]?.end_weight || 0) - ($feeds[0]?.start_weight || 0)) /
						(rangeH / 24)
				)}g
			</div>
			<div class="stat-desc">Average daily weight change</div>
		</div>

		<div class="stat">
			<div class="stat-title">Daily Feeds</div>
			<div class="stat-value">
				{Math.round($feeds.length / (rangeH / 24))}
			</div>
			<div class="stat-desc">Number of feeds per day</div>
		</div>

		<div class="stat">
			<div class="stat-title">Weekly Gain</div>
			<div class="stat-value">
				{Math.round(
					(7 * (($feeds[$feeds.length - 1]?.end_weight || 0) - ($feeds[0]?.start_weight || 0))) /
						(differenceInHours(
							new Date($feeds[$feeds.length - 1]?.date_created || Date.now()),
							new Date($feeds[0]?.date_created || Date.now())
						) /
							24)
				)}g
			</div>
			<div class="stat-desc">Average weekly weight change</div>
		</div>

		<div class="stat">
			<div class="stat-title">Minimum Feed Volume</div>
			<div class="stat-value">
				{Math.round(
					(150 * ($feeds[$feeds.length - 1]?.end_weight / 1000)) / ($feeds.length / (rangeH / 24))
				)}g
			</div>
			<div class="stat-desc">Based on 150ml/kg/day</div>
		</div>
	</div>
{/if}
