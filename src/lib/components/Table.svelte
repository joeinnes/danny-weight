<script lang="ts">
	import { feeds } from '$lib/stores/stores';
</script>

{#if $feeds?.length}
	<div class="overflow-x-auto">
		<table class="table table-zebra w-full" style="caption-side: bottom;">
			<caption class="table-caption italic"><small>* Weights are estimated</small></caption>
			<thead>
				<tr>
					<th scope="col"> Feed Date/Time </th>
					<th scope="col"> Feed Start Weight </th>
					<th scope="col"> Feed End Weight </th>
					<th scope="col"> Net Gain </th>
				</tr>
			</thead>
			<tbody>
				{#each [...$feeds].reverse() as feed}
					<tr class:italic={feed.estimated}>
						<td
							>{new Date(feed?.date_created || Date.now()).toLocaleString('en-GB', {
								weekday: 'short',
								year: 'numeric',
								month: 'short',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit'
							})}{#if feed.estimated}*{/if}</td
						>
						<td
							>{feed.start_weight}g{#if feed.estimated}*{/if}</td
						>
						<td
							>{feed.end_weight}g{#if feed.estimated}*{/if}</td
						>
						<td
							>{(feed?.end_weight || 0) - (feed?.start_weight || 0)}g{#if feed.estimated}*{/if}</td
						>
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
