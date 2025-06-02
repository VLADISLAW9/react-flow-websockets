import { create } from "zustand";

export interface UseRoomStore {
  roomId: string | undefined;
  users: string[];
  setRoomId: (roomId: string) => void;
  setUsers: (users: string[]) => void;
}

export const useRoomStore = create<UseRoomStore>((set) => ({
  roomId: undefined,
  users: [],
  setRoomId: (roomId) => {
    set({ roomId });
  },
  setUsers: (users) => {
    set({ users });
  },
}));
