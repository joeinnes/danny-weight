<script lang="ts">
	import { Chart, registerables } from 'chart.js';
	import 'chartjs-adapter-date-fns';
	import { enGB } from 'date-fns/locale/index.js';

	import { feeds } from '$lib/stores/stores';

	Chart.register(...registerables);

	let chart: HTMLCanvasElement;
	let myChart: Chart;

	$: {
		if (chart && myChart && $feeds?.length) {
			myChart.data.datasets[0].data = $feeds.map((el) => el.end_weight || 0);
			myChart.data.labels = $feeds.map((el) => el.date_created);
			myChart.update();
		} else if (chart && $feeds?.length) {
			myChart = new Chart(chart, {
				type: 'line',
				data: {
					labels: $feeds.map((el) => el.date_created),
					datasets: [
						{
							label: '',
							data: $feeds.map((el) => el.end_weight || 0),
							tension: 0.4,
							backgroundColor: '#000',
							borderColor: '#000'
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
					scales: {
						x: {
							type: 'time',
							ticks: {
								source: 'auto'
							},
							time: {
								unit: 'day'
							},
							adapters: {
								date: {
									locale: enGB
								}
							},
							grid: {
								drawTicks: false
							}
						},
						y: {
							title: {
								display: false,
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
	}
</script>

<div>
	<canvas bind:this={chart} />
</div>
