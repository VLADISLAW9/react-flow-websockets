import { create } from 'zustand';

import type { User } from '../types';

interface UseUsersStore {
  users: User[];
  setUsers: (users: User[]) => void;
}

export const useUsersStore = create<UseUsersStore>((set) => ({
  users: [],
  setUsers: (users) => set({ users })
}));
