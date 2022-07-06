import type { PartialItem } from '@directus/sdk';
import { writable } from 'svelte/store';

export interface Weight {
  date_created: Date;
  start_weight: number;
  end_weight: number;
  estimated: boolean;
}

export const feeds = writable<Weight[] | null | undefined>([]);
