import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

const config = {
	kit: {
		adapter: adapter(),
		vite: {
			ssr: {
				noExternal: ['chart.js', 'chartjs-plugin-trendline']
			}
		}
	},
	preprocess: [
		preprocess({
			postcss: true
		})
	]
};

export default config;
