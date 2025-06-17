import { create } from 'zustand';

import type { AppNode } from '../types';

interface UseNodeDrawerStore {
  node: AppNode | null;
  close: () => void;
  open: (node: AppNode) => void;
}

export const useNodeDrawerStore = create<UseNodeDrawerStore>((set) => ({
  node: null,
  close: () => set({ node: null }),
  open: (node) => set({ node })
}));
