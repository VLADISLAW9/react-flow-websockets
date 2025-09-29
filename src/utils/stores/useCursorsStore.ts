import { create } from 'zustand';

import type { Cursor } from '../types';

interface UseCursorsStore {
  cursors: Cursor[];
  setCursors: (cursors: Cursor[]) => void;
}

export const useCursorsStore = create<UseCursorsStore>((set) => ({
  cursors: [],
  setCursors: (cursors) => set({ cursors })
}));
