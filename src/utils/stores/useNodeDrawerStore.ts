import { create } from 'zustand';

import type { AppNode } from '../types';

interface UseNodeDrawerStore {
  nodeId: AppNode['id'] | null;

  close: () => void;
  open: (nodeId: AppNode['id']) => void;
}

export const useNodeDrawerStore = create<UseNodeDrawerStore>((set) => ({
  nodeId: null,
  close: () => set({ nodeId: null }),
  open: (nodeId) => set({ nodeId })
}));
