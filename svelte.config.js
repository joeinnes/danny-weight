import adapter from '@sveltejs/adapter-auto';

const config = {
	kit: {
		adapter: adapter(),
		vite: {
			ssr: {
				noExternal: ['chart.js']
			}
		}
	}
};

export default config;
