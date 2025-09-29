import { create } from 'zustand';

import type { Member } from '../types';

interface UseProfileStore {
  profile: Member | null;
  setProfile: (profile: Member) => void;
}

export const useProfileStore = create<UseProfileStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile })
}));
