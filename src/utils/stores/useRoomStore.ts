import { create } from 'zustand';

export interface UseRoomStore {
  roomId: string | null;
  users: string[];
  setRoomId: (roomId: string) => void;
  setUsers: (users: string[]) => void;
}

export const useRoomStore = create<UseRoomStore>((set) => ({
  roomId: null,
  users: [],
  setRoomId: (roomId) => {
    set({ roomId });
  },
  setUsers: (users) => {
    set({ users });
  }
}));
