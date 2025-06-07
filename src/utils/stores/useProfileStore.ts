import { create } from 'zustand';

import type { User } from '../types';

interface UseProfileStore {
  profile: User | null;
  setProfile: (profile: User) => void;
}

export const useProfileStore = create<UseProfileStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile })
}));
