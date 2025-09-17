import { create } from 'zustand';

import type { UserCursor } from '../types';

interface UseCursorsStore {
  cursors: UserCursor[];
  setCursors: (cursors: UserCursor[]) => void;
}

export const useCursorsStore = create<UseCursorsStore>((set) => ({
  cursors: [],
  setCursors: (cursors) => set({ cursors })
}));
