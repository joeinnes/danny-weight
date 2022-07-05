import { Directus } from '@directus/sdk';
import type { Weight } from './stores/stores';

type DannyCollections = {
  feeds: Weight;
};
export const directus = new Directus<DannyCollections>('https://api.innes.hu');
