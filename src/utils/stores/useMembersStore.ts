import { create } from 'zustand';

import type { Member } from '../types';

interface useMembersStore {
  members: Member[];
  setMembers: (members: Member[]) => void;
}

export const useMembersStore = create<useMembersStore>((set) => ({
  members: [],
  setMembers: (members) => set({ members })
}));
